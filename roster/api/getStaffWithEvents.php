<?php
// Set response type to JSON
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "company_schedule";

// Create MySQLi connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Query to get staff with their events
$sql = "SELECT s.id AS staff_id, s.name, s.role, s.department, s.photoUrl, s.color, 
               e.id AS event_id, e.start, e.end, e.type, e.title, e.description
        FROM staff s
        LEFT JOIN events e ON s.id = e.staff_id
        ORDER BY s.name, e.start";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    $conn->close();
    exit();
}

$staff = [];

while ($row = $result->fetch_assoc()) {
    $staffId = $row['staff_id'];

    // Add staff if not already added
    if (!isset($staff[$staffId])) {
        $staff[$staffId] = [
            'id' => $staffId,
            'name' => $row['name'],
            'role' => $row['role'],
            'department' => $row['department'],
            'photoUrl' => $row['photoUrl'],
            'color' => $row['color'],
            'events' => []
        ];
    }

    // Add event if it exists
    if ($row['event_id']) {
        $staff[$staffId]['events'][] = [
            'id' => $row['event_id'],
            'start' => (int)$row['start'],
            'end' => (int)$row['end'],
            'type' => $row['type'],
            'title' => $row['title'],
            'description' => $row['description']
        ];
    }
}

$conn->close();

// Reindex to get a clean array (not associative)
$staff = array_values($staff);

// Return JSON response
echo json_encode($staff, JSON_PRETTY_PRINT);
