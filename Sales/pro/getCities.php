<?php
require_once 'db_connection.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT DISTINCT city FROM tbl_events 
    WHERE city IS NOT NULL AND city != '' ORDER BY city");
    $cities = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode($cities);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch cities']);
}
