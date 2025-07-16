<?php
// ------------------------------
// Enable error reporting (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ------------------------------
// Configure session cookie (IMPORTANT for cross-domain / path handling)
session_set_cookie_params([
  'lifetime' => 0,
  'path' => '/',
  'domain' => '.staffscroll.co.uk', // <-- change to match your domain, e.g., '.example.com'
  'secure' => isset($_SERVER['HTTPS']), // Use true if HTTPS
  'httponly' => true,
  'samesite' => 'Lax'
]);

// Start session (MUST be before output)
session_start();

// ------------------------------
// Debug: Check if headers already sent
if (headers_sent($file, $line)) {
  die("Headers already sent in $file on line $line");
}

// ------------------------------
// Load DB connection (ensure $pdo is defined)
require_once 'db_connection.php';

if (!$pdo) {
  die("Database connection failed.");
}

// ------------------------------
// Check if user is logged in
if (empty($_SESSION['usr_specialId'])) {
  $_SESSION['redirect_after_login'] = $_SERVER['HTTP_REFERER'] ?? 'index.php';
  header("Location: ../../page/account/");
  exit;
}

// ------------------------------
// Get user info from session and DB
$specialId = $_SESSION['usr_specialId'];
$sql = "SELECT * FROM tbl_users WHERE specialId = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$specialId]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
  die("User not found.");
}

// Extract user data
$col_fullname     = htmlspecialchars($row["col_fullname"]);
$company_name     = htmlspecialchars($row["company_name"]);
$company_email    = htmlspecialchars($row["col_email"]);
$company_domain   = htmlspecialchars($row["company_domain"]);
$company_uniqueId = htmlspecialchars($row["specialId"]);
$licence_status   = 'Trial';
$version          = 'Pro';
$paymentLink      = 'https://buy.stripe.com/9B63cu40Dc9fbsc9XGaVa04';
$btn_status       = 'Buy licence';

// ------------------------------
// ID Generators
function generateSpecialId($length = 8)
{
  try {
    return strtoupper(bin2hex(random_bytes($length / 2)));
  } catch (Exception $e) {
    error_log("ID generation failed: " . $e->getMessage());
    return strtoupper(bin2hex(openssl_random_pseudo_bytes($length / 2)));
  }
}

function generateFormattedId()
{
  $prefix      = 'li598c';
  $randomChars = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'), 0, 3);
  $randomNum   = rand(100, 999);
  return $prefix . '-' . $randomChars . $randomNum . '-' . uniqid();
}

$licence      = generateFormattedId() . '-' . generateSpecialId();
$authorization = (new DateTime('+2 weeks'))->format('Y-m-d');

// ------------------------------
// Check if company already exists
$checkStmt = $pdo->prepare("SELECT 1 FROM tbl_company WHERE company_email = ? AND version = ?");
$checkStmt->execute([$company_email, $version]);

if ($checkStmt->fetch()) {
  header("Location: ../../page/account/licence");
  exit;
}

// ------------------------------
// Insert new licence
$insertSql = "
    INSERT INTO tbl_company (
        fullname, company_name, licence, licence_status,
        company_email, company_domain,
        authorization, version, slug, btn_status, uzi8n
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$insertStmt = $pdo->prepare($insertSql);
$success = $insertStmt->execute([
  $col_fullname,
  $company_name,
  $licence,
  $licence_status,
  $company_email,
  $company_domain,
  $authorization,
  $version,
  $paymentLink,
  $btn_status,
  $company_uniqueId
]);

if (!$success) {
  $errorInfo = $insertStmt->errorInfo();
  error_log("DB insert failed: " . implode(" | ", $errorInfo));
  header("Location: ../../page/account/");
  exit;
}

// ------------------------------
// Prepare file download
$filename = 'pro-trial.zip';
$filepath = __DIR__ . '/downloads/' . $filename;

if (file_exists($filepath)) {
  header('Content-Description: File Transfer');
  header('Content-Type: application/zip');
  header('Content-Disposition: attachment; filename="' . basename($filepath) . '"');
  header('Expires: 0');
  header('Cache-Control: must-revalidate');
  header('Pragma: public');
  header('Content-Length: ' . filesize($filepath));
  flush();
  readfile($filepath);
  exit;
} else {
  die("The requested file does not exist.");
}
