<?php
require_once 'db_connection.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT DISTINCT col_area_city FROM tbl_schedule_calls WHERE col_area_city IS NOT NULL AND col_area_city != '' ORDER BY col_area_city");
    $cities = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode($cities);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch cities']);
}
