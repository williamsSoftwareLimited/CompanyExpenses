import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { type Expense, summarizeExpenses } from '../../src/utils/expenseMath.js';
import { buildProjectOverview, readExpoConfig, readPackageJson } from './projectFiles.mjs';

const server = new McpServer({
  name: 'company-expenses-expo',
  version: '0.1.0',
});

const expenseSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  description: z.string(),
  createdDate: z.string(),
  updatedDate: z.string(),
  receipt: z.string().nullable(),
});

server.registerTool(
  'summarize-expenses',
  {
    title: 'Summarize expenses',
    description: 'Calculate spend, remaining budget, and budget status for a list of expenses.',
    inputSchema: {
      totalBudget: z.number().nonnegative(),
      expenses: z.array(expenseSchema),
    },
  },
  async ({ totalBudget, expenses }) => {
    const summary = summarizeExpenses(expenses as Expense[], totalBudget);

    return {
      content: [
        {
          type: 'text',
          text: [
            `Budget: ${summary.formattedTotalBudget}`,
            `Spent: ${summary.formattedTotalSpent}`,
            `Remaining: ${summary.formattedRemainingBudget}`,
            `Status: ${summary.budgetStatus}`,
            `Expense count: ${summary.expenseCount}`,
          ].join('\n'),
        },
      ],
      structuredContent: summary,
    };
  }
);

server.registerTool(
  'get-project-overview',
  {
    title: 'Get project overview',
    description: 'Read the Expo app and package configuration for this mobile project.',
    inputSchema: {},
  },
  async () => {
    const overview = await buildProjectOverview();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(overview, null, 2),
        },
      ],
      structuredContent: overview,
    };
  }
);

server.registerResource(
  'expo-app-config',
  'config://expo/app',
  {
    title: 'Expo app config',
    description: 'Current app.json contents for the Expo mobile app.',
    mimeType: 'application/json',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(await readExpoConfig(), null, 2),
      },
    ],
  })
);

server.registerResource(
  'expo-package-config',
  'config://expo/package',
  {
    title: 'Package config',
    description: 'Current package.json contents for the Expo mobile app.',
    mimeType: 'application/json',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'application/json',
        text: JSON.stringify(await readPackageJson(), null, 2),
      },
    ],
  })
);

server.registerPrompt(
  'write-expense-report',
  {
    title: 'Write expense report',
    description: 'Draft a concise monthly expense summary from budget and expense JSON.',
    argsSchema: {
      totalBudget: z.number().nonnegative(),
      expensesJson: z.string(),
    },
  },
  ({ totalBudget, expensesJson }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            'Write a concise monthly company expense report.',
            `Budget: ${totalBudget}`,
            `Expenses JSON: ${expensesJson}`,
            'Include the total spent, remaining budget, status, and any notable spend categories.',
          ].join('\n'),
        },
      },
    ],
  })
);

const transport = new StdioServerTransport();

await server.connect(transport);
