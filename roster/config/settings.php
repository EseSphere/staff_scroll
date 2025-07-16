<?php
return [
  'displayErrorDetails' => true,
  'db' => [
    'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
    'user' => $_ENV['DB_USER'] ?? 'root',
    'pass' => $_ENV['DB_PASSWORD'] ?? '',
    'dbname' => $_ENV['DB_NAME'] ?? 'company_schedule'
  ]
];
