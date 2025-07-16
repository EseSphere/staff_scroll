<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'staffscroll');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Create MySQLi connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    error_log("Database connection failed: " . $mysqli->connect_error);
    die("Database connection failed. Please try again later.");
}

// Set charset
if (!$conn->set_charset(DB_CHARSET)) {
    error_log("Error loading character set " . DB_CHARSET . ": " . $mysqli->error);
    die("Error setting character set.");
}
