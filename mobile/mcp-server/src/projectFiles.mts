import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type ExpoConfig = {
  expo: {
    name: string;
    slug: string;
    version: string;
    orientation?: string;
    newArchEnabled?: boolean;
  };
};

type PackageJson = {
  name: string;
  version: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
};

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(sourceDirectory, '..', '..', '..');

const readJsonFile = async <T,>(relativePath: string): Promise<T> =>
  JSON.parse(await readFile(resolve(projectRoot, relativePath), 'utf8')) as T;

export const readExpoConfig = async (): Promise<ExpoConfig> => readJsonFile<ExpoConfig>('app.json');

export const readPackageJson = async (): Promise<PackageJson> => readJsonFile<PackageJson>('package.json');

export const buildProjectOverview = async () => {
  const [appConfig, packageJson] = await Promise.all([readExpoConfig(), readPackageJson()]);

  return {
    appName: appConfig.expo.name,
    appSlug: appConfig.expo.slug,
    appVersion: appConfig.expo.version,
    expoSdkVersion: packageJson.dependencies?.expo ?? 'unknown',
    newArchitectureEnabled: appConfig.expo.newArchEnabled ?? false,
    availableScripts: packageJson.scripts ?? {},
  };
};
