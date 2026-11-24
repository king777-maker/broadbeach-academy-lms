<?php
/**
 * ============================================================================
 * Broadbeach LMS — Central Certificate Persistence Endpoint (GoDaddy cPanel)
 * Self-healing: automatically creates database table if not present.
 * ============================================================================
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');

// 1. CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, X-Admin-Token, X-User-Token");
header("Content-Type: application/json; charset=UTF-8");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST requests are allowed.']);
    exit;
}

// 2. Database Connection using exact credentials from your config/database.php
$db = null;
$dbHost = 'localhost';
$dbUser = 'bb_user';
$dbPass = 'Dw*$k{z#^vS1';
$dbName = 'bb';

try {
    $db = @new mysqli($dbHost, $dbUser, $dbPass, $dbName);
} catch (Throwable $t) {
    $db = null;
}

if (!$db || $db->connect_error) {
    $possibleConfigFiles = [
        __DIR__ . '/../config/database.php',
        __DIR__ . '/config/database.php',
    ];
    foreach ($possibleConfigFiles as $cfg) {
        if (file_exists($cfg)) {
            require_once $cfg;
            if (class_exists('database')) {
                try {
                    $obj = new database();
                    if (method_exists($obj, 'connect')) {
                        $db = $obj->connect();
                        if ($db instanceof mysqli && !$db->connect_error) break;
                    }
                } catch (Throwable $t2) {}
            }
        }
    }
}

if (!$db || $db->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . ($db ? $db->connect_error : 'Unable to connect to MySQL'),
    ]);
    exit;
}

$db->set_charset("utf8mb4");

// 3. Self-healing: Auto-create certificates table if it does not exist
try {
    $db->query("CREATE TABLE IF NOT EXISTS `certificates` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `certificate_code` VARCHAR(100) NOT NULL,
      `certificate_number` VARCHAR(100) NOT NULL,
      `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
      `student_name` VARCHAR(255) NOT NULL,
      `student_email` VARCHAR(255) NOT NULL,
      `course_id` VARCHAR(100) NOT NULL,
      `course_title` VARCHAR(255) NOT NULL,
      `score` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
      `total_questions` INT NOT NULL DEFAULT 10,
      `percentage` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
      `issue_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `issued_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `certificate_url` VARCHAR(500) NULL DEFAULT NULL,
      `pdf_path` VARCHAR(500) NULL DEFAULT NULL,
      `status` VARCHAR(50) NOT NULL DEFAULT 'valid',
      `verification_status` VARCHAR(50) NOT NULL DEFAULT 'Valid',
      `source` VARCHAR(50) NOT NULL DEFAULT 'online',
      `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      INDEX (`certificate_code`),
      INDEX (`certificate_number`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Also safely add missing columns if table already existed
    @$db->query("ALTER TABLE `certificates` ADD COLUMN IF NOT EXISTS `certificate_code` VARCHAR(100) NULL");
    @$db->query("ALTER TABLE `certificates` ADD COLUMN IF NOT EXISTS `student_email` VARCHAR(255) NULL");
    @$db->query("ALTER TABLE `certificates` ADD COLUMN IF NOT EXISTS `course_title` VARCHAR(255) NULL");
    @$db->query("ALTER TABLE `certificates` ADD COLUMN IF NOT EXISTS `verification_status` VARCHAR(50) DEFAULT 'Valid'");
} catch (Throwable $e) {
    // Continue even if schema alters fail
}

// 4. Parse JSON / POST Input
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$certCode = trim($input['certificate_code'] ?? $input['certificate_number'] ?? '');
$userId = !empty($input['user_id']) ? (int)$input['user_id'] : null;
$studentName = strtoupper(trim($input['student_name'] ?? 'Verified Learner'));
$studentEmail = trim($input['student_email'] ?? $input['candidate_email'] ?? $input['email'] ?? 'certified@broadbeachonline.com');
$courseId = trim((string)($input['course_id'] ?? $input['certification_id'] ?? '322'));
$courseTitle = trim($input['course_title'] ?? $input['course_name'] ?? 'Professional Credential');
$score = isset($input['score']) ? (float)$input['score'] : 10.0;
$totalQuestions = isset($input['total_questions']) ? (int)$input['total_questions'] : (isset($input['total']) ? (int)$input['total'] : 10);
$percentage = isset($input['percentage']) ? (float)$input['percentage'] : 100.0;
$certificateUrl = trim($input['certificate_url'] ?? $input['pdf_path'] ?? '');
$status = trim($input['status'] ?? 'valid');
$verificationStatus = trim($input['verification_status'] ?? 'Valid');
$issueDate = trim($input['issue_date'] ?? $input['issued_at'] ?? date('Y-m-d H:i:s'));

if (empty($certCode)) {
    $certCode = '26BB' . str_pad((string)mt_rand(10000, 99999), 5, '0', STR_PAD_LEFT);
}
$certNumber = $certCode;

// 5. Duplicate Check & Save
try {
    $existingId = null;
    $chkSql = "SELECT id, certificate_code, certificate_number FROM certificates WHERE certificate_code = '" . $db->real_escape_string($certCode) . "' OR certificate_number = '" . $db->real_escape_string($certCode) . "'";
    if ($userId) {
        $chkSql .= " OR (user_id = " . (int)$userId . " AND course_id = '" . $db->real_escape_string($courseId) . "')";
    }
    $chkSql .= " LIMIT 1";

    $chkRes = $db->query($chkSql);
    if ($chkRes && $row = $chkRes->fetch_assoc()) {
        $existingId = (int)$row['id'];
        $certCode = $row['certificate_code'] ?: $row['certificate_number'];
        $certNumber = $certCode;
    }

    if ($existingId) {
        $upd = "UPDATE certificates SET 
            student_name = '" . $db->real_escape_string($studentName) . "',
            student_email = '" . $db->real_escape_string($studentEmail) . "',
            course_title = '" . $db->real_escape_string($courseTitle) . "',
            score = " . $score . ",
            total_questions = " . $totalQuestions . ",
            percentage = " . $percentage . ",
            status = '" . $db->real_escape_string($status) . "',
            verification_status = '" . $db->real_escape_string($verificationStatus) . "',
            updated_at = NOW()
            WHERE id = " . $existingId;
        $db->query($upd);
        $recordId = $existingId;
        $isNew = false;
    } else {
        $ins = "INSERT INTO certificates (
            certificate_code, certificate_number, user_id, student_name, student_email,
            course_id, course_title, score, total_questions, percentage,
            issue_date, issued_at, certificate_url, pdf_path, status, verification_status,
            source, created_at, updated_at
        ) VALUES (
            '" . $db->real_escape_string($certCode) . "',
            '" . $db->real_escape_string($certNumber) . "',
            " . ($userId ? (int)$userId : "NULL") . ",
            '" . $db->real_escape_string($studentName) . "',
            '" . $db->real_escape_string($studentEmail) . "',
            '" . $db->real_escape_string($courseId) . "',
            '" . $db->real_escape_string($courseTitle) . "',
            " . $score . ",
            " . $totalQuestions . ",
            " . $percentage . ",
            '" . $db->real_escape_string($issueDate) . "',
            '" . $db->real_escape_string($issueDate) . "',
            '" . $db->real_escape_string($certificateUrl) . "',
            '" . $db->real_escape_string($certificateUrl) . "',
            '" . $db->real_escape_string($status) . "',
            '" . $db->real_escape_string($verificationStatus) . "',
            'online',
            NOW(),
            NOW()
        )";
        $db->query($ins);
        $recordId = $db->insert_id;
        $isNew = true;
    }

    echo json_encode([
        'success' => true,
        'message' => $isNew ? 'Certificate successfully saved to central server.' : 'Certificate record updated in central server.',
        'data' => [
            'id' => $recordId,
            'certificate_code' => $certCode,
            'certificate_number' => $certNumber,
            'user_id' => $userId,
            'student_name' => $studentName,
            'student_email' => $studentEmail,
            'candidate_email' => $studentEmail,
            'course_id' => $courseId,
            'course_name' => $courseTitle,
            'course_title' => $courseTitle,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'percentage' => $percentage,
            'issue_date' => $issueDate,
            'issued_at' => $issueDate,
            'certificate_url' => $certificateUrl,
            'pdf_path' => $certificateUrl,
            'status' => $status,
            'verification_status' => $verificationStatus,
            'source' => 'online',
        ],
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to persist certificate: ' . $e->getMessage(),
    ]);
}
