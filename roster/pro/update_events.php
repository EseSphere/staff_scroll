<?php

//update_events.php

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['updates']) || !is_array($input['updates'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$updates = $input['updates'];

// DB connection settings
$host = 'localhost';
$db   = 'staffscroll';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed: ' . $e->getMessage()]);
    exit;
}

// Prepare update statement with original_staff_uniqueId and original_start_time for locating record
$sql = "UPDATE tbl_event
        SET start_time = :start_time, end_time = :end_time, staff_uniqueId = :staff_uniqueId
        WHERE userId = :userId AND staff_uniqueId = :original_staff_uniqueId AND start_time = :original_start_time";

$stmt = $pdo->prepare($sql);

try {
    foreach ($updates as $event) {
        if (
            !isset(
                $event['userId'],
                $event['staff_uniqueId'],
                $event['start_time'],
                $event['end_time'],
                $event['original_staff_uniqueId'],
                $event['original_start_time']
            )
        ) {
            continue; // Skip invalid update
        }

        $stmt->execute([
            ':userId' => $event['userId'],
            ':staff_uniqueId' => $event['staff_uniqueId'], // new staff id
            ':start_time' => $event['start_time'],
            ':end_time' => $event['end_time'],
            ':original_staff_uniqueId' => $event['original_staff_uniqueId'], // original staff id
            ':original_start_time' => $event['original_start_time'],
        ]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $e->getMessage()]);
}
