<?php
header('Content-Type: application/json');

// Update with your DB credentials
$host = 'localhost';
$db = 'staffscroll';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Expecting week start date (Sunday) as GET param, format YYYY-MM-DD
    if (!isset($_GET['weekStart'])) {
        http_response_code(400);
        echo json_encode(['error' => 'weekStart parameter missing']);
        exit;
    }

    $weekStart = $_GET['weekStart'];
    $weekEnd = date('Y-m-d', strtotime("$weekStart +6 days"));

    // Fetch staff grouped by date within the week
    $stmt = $pdo->prepare("
        SELECT work_date, staff_name
        FROM staff_schedule
        WHERE work_date BETWEEN :weekStart AND :weekEnd
        ORDER BY work_date, staff_name
    ");
    $stmt->execute(['weekStart' => $weekStart, 'weekEnd' => $weekEnd]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    // Initialize all dates in range with empty arrays to avoid missing days
    for ($i = 0; $i < 7; $i++) {
        $date = date('Y-m-d', strtotime("$weekStart +$i days"));
        $result[$date] = [];
    }

    foreach ($rows as $row) {
        $result[$row['work_date']][] = $row['staff_name'];
    }

    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
