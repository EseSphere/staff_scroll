<?php
// get_schedule.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// Include DB connection
require_once 'db_connection.php';
function timeToDecimal($timeStr)
{
    if (!$timeStr) return 0;
    list($hours, $minutes) = explode(':', $timeStr);
    return intval($hours) + intval($minutes) / 60;
}

$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

try {
    // Fetch all staff
    $staffStmt = $pdo->query("SELECT * FROM tbl_staff ORDER BY firstName");
    $staffs = $staffStmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch events for the specific date
    $eventStmt = $pdo->prepare("SELECT * FROM tbl_events WHERE `event_date` = ?");
    $eventStmt->execute([$date]);
    $events = $eventStmt->fetchAll(PDO::FETCH_ASSOC);

    // Group events by staff_id
    $groupedEvents = [];
    foreach ($events as $event) {
        $groupedEvents[$event['staff_uniqueId']][] = [
            'id' => '' . $event['userId'],
            'start' => timeToDecimal($event['start_time']),
            'end' => timeToDecimal($event['end_time']),
            'type' => $event['care_calls'],
            'group' => $event['city'],
            'title' => $event['client_name'],
            'description' => $event['status'],
            'run' => $event['run_name'],
            'staff_uniqueId' => $event['staff_uniqueId'] // Add for safety check
        ];
    }

    // Combine staff with their events
    foreach ($staffs as $staff) {
        $staffId = $staff['uniqueId'];
        $eventsForStaff = $groupedEvents[$staffId] ?? [];
        $result[] = [
            'id' => 'staff-' . $staffId,
            'name' => $staff['firstName'] . ' ' . $staff['lastName'],
            'group' => isset($eventsForStaff[0]['group']) ? $eventsForStaff[0]['group'] : null,
            'department' => $staff['transportation'],
            'photoUrl' => $staff['transportation'],
            'color' => $event['timeline_colour'] ?? '#192a56', // Default color if not set
            'events' => $eventsForStaff,
        ];
    }


    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB query error: ' . $e->getMessage()]);
}
