<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_THROW_ON_ERROR);
    exit;
}

function readJsonBody(): array
{
    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($decoded)) {
        throw new InvalidArgumentException('Request body must be a JSON object.');
    }

    return $decoded;
}

function parsePositiveInt(mixed $value, string $field): int
{
    if (!is_numeric($value) || (int) $value < 1) {
        throw new InvalidArgumentException(sprintf('%s must be a positive integer.', $field));
    }

    return (int) $value;
}

function parseAmount(mixed $value, string $field, bool $allowNull = false): ?float
{
    if ($allowNull && $value === null) {
        return null;
    }

    if (!is_numeric($value)) {
        throw new InvalidArgumentException(sprintf('%s must be numeric.', $field));
    }

    return round((float) $value, 2);
}

function mapExpense(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'companyId' => (int) $row['company_id'],
        'title' => (string) $row['title'],
        'amount' => (float) $row['amount'],
        'vatAmount' => $row['vat_amount'] === null ? null : (float) $row['vat_amount'],
        'description' => (string) $row['description'],
        'receipt' => $row['receipt'] !== null ? (string) $row['receipt'] : null,
        'createdDate' => (new DateTimeImmutable((string) $row['created_at']))->format(DATE_ATOM),
        'updatedDate' => (new DateTimeImmutable((string) $row['updated_at']))->format(DATE_ATOM),
    ];
}

function fetchExpenseById(PDO $pdo, int $expenseId): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, company_id, title, amount, vat_amount, description, receipt, created_at, updated_at
         FROM expenses
         WHERE id = :id'
    );
    $statement->bindValue(':id', $expenseId, PDO::PARAM_INT);
    $statement->execute();
    $row = $statement->fetch();

    return $row === false ? null : $row;
}

try {
    $pdo = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if ($method === 'GET') {
        $idInput = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if ($idInput !== null && $idInput !== false) {
            $row = fetchExpenseById($pdo, (int) $idInput);
            if ($row === null) {
                respond(404, ['error' => 'Expense not found.']);
            }

            respond(200, ['expense' => mapExpense($row)]);
        }

        $companyIdInput = filter_input(INPUT_GET, 'company_id', FILTER_VALIDATE_INT);
        if ($companyIdInput !== null && $companyIdInput !== false) {
            $statement = $pdo->prepare(
                'SELECT id, company_id, title, amount, vat_amount, description, receipt, created_at, updated_at
                 FROM expenses
                 WHERE company_id = :company_id
                 ORDER BY created_at DESC, id DESC'
            );
            $statement->bindValue(':company_id', (int) $companyIdInput, PDO::PARAM_INT);
        } else {
            $statement = $pdo->prepare(
                'SELECT id, company_id, title, amount, vat_amount, description, receipt, created_at, updated_at
                 FROM expenses
                 ORDER BY created_at DESC, id DESC'
            );
        }

        $statement->execute();
        $rows = $statement->fetchAll();
        respond(200, ['expenses' => array_map('mapExpense', $rows)]);
    }

    if ($method === 'POST') {
        $payload = readJsonBody();

        $companyId = parsePositiveInt($payload['company_id'] ?? null, 'company_id');
        $title = trim((string) ($payload['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('title is required.');
        }

        $amount = parseAmount($payload['amount'] ?? null, 'amount');
        $vatAmount = parseAmount($payload['vat_amount'] ?? null, 'vat_amount', true);
        $description = trim((string) ($payload['description'] ?? ''));
        $receipt = $payload['receipt'] ?? null;
        if ($receipt !== null) {
            $receipt = trim((string) $receipt);
            if ($receipt === '') {
                $receipt = null;
            }
        }

        $statement = $pdo->prepare(
            'INSERT INTO expenses (company_id, title, amount, vat_amount, description, receipt)
             VALUES (:company_id, :title, :amount, :vat_amount, :description, :receipt)'
        );
        $statement->bindValue(':company_id', $companyId, PDO::PARAM_INT);
        $statement->bindValue(':title', $title, PDO::PARAM_STR);
        $statement->bindValue(':amount', $amount);
        $statement->bindValue(':vat_amount', $vatAmount);
        $statement->bindValue(':description', $description, PDO::PARAM_STR);
        $statement->bindValue(':receipt', $receipt);
        $statement->execute();

        $created = fetchExpenseById($pdo, (int) $pdo->lastInsertId());
        respond(201, ['expense' => $created === null ? null : mapExpense($created)]);
    }

    if ($method === 'PUT') {
        $expenseIdInput = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if ($expenseIdInput === null || $expenseIdInput === false) {
            throw new InvalidArgumentException('id query parameter is required.');
        }

        $existing = fetchExpenseById($pdo, (int) $expenseIdInput);
        if ($existing === null) {
            respond(404, ['error' => 'Expense not found.']);
        }

        $payload = readJsonBody();
        $companyId = array_key_exists('company_id', $payload)
            ? parsePositiveInt($payload['company_id'], 'company_id')
            : (int) $existing['company_id'];
        $title = array_key_exists('title', $payload) ? trim((string) $payload['title']) : (string) $existing['title'];
        if ($title === '') {
            throw new InvalidArgumentException('title cannot be empty.');
        }

        $amount = array_key_exists('amount', $payload)
            ? parseAmount($payload['amount'], 'amount')
            : (float) $existing['amount'];
        $vatAmount = array_key_exists('vat_amount', $payload)
            ? parseAmount($payload['vat_amount'], 'vat_amount', true)
            : ($existing['vat_amount'] === null ? null : (float) $existing['vat_amount']);
        $description = array_key_exists('description', $payload)
            ? trim((string) $payload['description'])
            : (string) $existing['description'];
        $receipt = array_key_exists('receipt', $payload) ? $payload['receipt'] : $existing['receipt'];
        if ($receipt !== null) {
            $receipt = trim((string) $receipt);
            if ($receipt === '') {
                $receipt = null;
            }
        }

        $statement = $pdo->prepare(
            'UPDATE expenses
             SET company_id = :company_id,
                 title = :title,
                 amount = :amount,
                 vat_amount = :vat_amount,
                 description = :description,
                 receipt = :receipt
             WHERE id = :id'
        );
        $statement->bindValue(':id', (int) $expenseIdInput, PDO::PARAM_INT);
        $statement->bindValue(':company_id', $companyId, PDO::PARAM_INT);
        $statement->bindValue(':title', $title, PDO::PARAM_STR);
        $statement->bindValue(':amount', $amount);
        $statement->bindValue(':vat_amount', $vatAmount);
        $statement->bindValue(':description', $description, PDO::PARAM_STR);
        $statement->bindValue(':receipt', $receipt);
        $statement->execute();

        $updated = fetchExpenseById($pdo, (int) $expenseIdInput);
        respond(200, ['expense' => $updated === null ? null : mapExpense($updated)]);
    }

    if ($method === 'DELETE') {
        $expenseIdInput = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if ($expenseIdInput === null || $expenseIdInput === false) {
            throw new InvalidArgumentException('id query parameter is required.');
        }

        $statement = $pdo->prepare('DELETE FROM expenses WHERE id = :id');
        $statement->bindValue(':id', (int) $expenseIdInput, PDO::PARAM_INT);
        $statement->execute();

        if ($statement->rowCount() === 0) {
            respond(404, ['error' => 'Expense not found.']);
        }

        respond(200, ['success' => true]);
    }

    respond(405, ['error' => 'Method not allowed.']);
} catch (InvalidArgumentException $exception) {
    respond(400, ['error' => $exception->getMessage()]);
} catch (JsonException $exception) {
    respond(400, ['error' => 'Invalid JSON payload.']);
} catch (Throwable $exception) {
    respond(500, ['error' => 'Unable to process expense request.']);
}
