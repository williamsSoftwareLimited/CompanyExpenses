INSERT INTO companies (id, name)
VALUES (1, 'Company Expenses Demo')
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

INSERT INTO expenses (company_id, title, amount, vat_amount, description, receipt, created_at, updated_at)
VALUES
    (1, 'Team Lunch', 120.00, NULL, 'Lunch with client success team.', NULL, '2026-01-05 09:00:00', '2026-01-05 09:00:00'),
    (1, 'Taxi', 65.00, NULL, 'Airport transfer for partner meeting.', NULL, '2026-01-09 08:30:00', '2026-01-09 08:30:00'),
    (1, 'Stationery', 40.00, NULL, 'Office stationery refill.', NULL, '2026-01-11 14:15:00', '2026-01-11 14:15:00')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    amount = VALUES(amount),
    vat_amount = VALUES(vat_amount),
    description = VALUES(description),
    receipt = VALUES(receipt),
    updated_at = VALUES(updated_at);
