<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once('db_connection.php');
$varToday = date('Y-m-d');

$query = "SELECT company_domain FROM tbl_company 
WHERE authorization >= '$varToday'";
$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Database query failed"]);
    exit;
}

$domains = [];
while ($row = $result->fetch_assoc()) {
    $domains[] = $row['company_domain'];
}

echo json_encode($domains);
