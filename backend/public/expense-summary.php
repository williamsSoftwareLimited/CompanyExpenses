<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

try {
    $companyId = filter_input(INPUT_GET, 'company_id', FILTER_VALIDATE_INT);
    $pdo = getDbConnection();

    if ($companyId !== null && $companyId !== false) {
        $statement = $pdo->prepare('SELECT COALESCE(SUM(amount), 0) AS total_spent FROM expenses WHERE company_id = :company_id');
        $statement->bindValue(':company_id', $companyId, PDO::PARAM_INT);
    } else {
        $statement = $pdo->prepare('SELECT COALESCE(SUM(amount), 0) AS total_spent FROM expenses');
    }

    $statement->execute();
    $result = $statement->fetch();

    echo json_encode([
        'total_spent' => isset($result['total_spent']) ? (float) $result['total_spent'] : 0.0,
    ], JSON_THROW_ON_ERROR);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Unable to fetch expense summary.',
    ], JSON_THROW_ON_ERROR);
}
