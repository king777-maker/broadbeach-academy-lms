<?php
/**
 * ============================================================================
 * Broadbeach LMS — Central Certificate Persistence Endpoint (GoDaddy cPanel)
 * POST /api/save_certificate.php or /api/certificates/save
 * ============================================================================
 */

// 1. CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://broadbeach-academy-lms-d5gx.vercel.app',
    'https://broadbeachonline.com',
    'https://www.broadbeachonline.com',
    'https://cadac.in',
    'https://www.cadac.in',
    'https://broadbeachlearning.com',
    'https://www.broadbeachlearning.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
];

if (!empty($origin)) {
    if (in_array($origin, $allowedOrigins, true) || preg_match('#^https://[a-zA-Z0-9_\-]+\.vercel\.app$#', $origin) || preg_match('#^https://.*github\.io$#', $origin)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header("Access-Control-Allow-Credentials: true");
    } else {
        header("Access-Control-Allow-Origin: *");
    }
} else {
    header("Access-Control-Allow-Origin: *");
}

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

// 2. Database Connection
$db = null;

// Try loading existing configuration if in backend directory
if (file_exists(__DIR__ . '/../configuration/config.php')) {
    require_once __DIR__ . '/../configuration/config.php';
    if (class_exists('mysqli')) {
        $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, defined('DB_PORT') ? DB_PORT : 3306);
    }
} elseif (file_exists(__DIR__ . '/configuration/config.php')) {
    require_once __DIR__ . '/configuration/config.php';
    if (class_exists('mysqli')) {
        $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, defined('DB_PORT') ? DB_PORT : 3306);
    }
}

// Fallback to environment or direct parameters if config not found
if (!$db || $db->connect_error) {
    $dbHost = getenv('DB_HOST') ?: 'localhost';
    $dbUser = getenv('DB_USER') ?: 'root';
    $dbPass = getenv('DB_PASSWORD') ?: '';
    $dbName = getenv('DB_NAME') ?: 'broad_beach_online';
    $dbPort = (int)(getenv('DB_PORT') ?: 3306);
    $db = new mysqli($dbHost, $dbUser, $dbPass, $dbName, $dbPort);
}

if ($db->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $db->connect_error,
    ]);
    exit;
}

$db->set_charset("utf8mb4");

// 3. Parse JSON / POST Input
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

// Handle PDF file upload if provided
$uploadedPdfUrl = null;
if (!empty($_FILES['certificate_pdf']['tmp_name'])) {
    $uploadDir = __DIR__ . '/../uploads/certificates/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }
    $ext = pathinfo($_FILES['certificate_pdf']['name'], PATHINFO_EXTENSION) ?: 'pdf';
    $fileName = 'cert_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $targetPath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['certificate_pdf']['tmp_name'], $targetPath)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $uploadedPdfUrl = $protocol . $_SERVER['HTTP_HOST'] . '/uploads/certificates/' . $fileName;
    }
}

// 4. Extract and Sanitize Parameters
$certCode = trim($input['certificate_code'] ?? $input['certificate_number'] ?? '');
$userId = !empty($input['user_id']) ? (int)$input['user_id'] : null;
$studentName = trim($input['student_name'] ?? '');
$studentEmail = trim($input['student_email'] ?? $input['candidate_email'] ?? $input['email'] ?? '');
$courseId = trim((string)($input['course_id'] ?? $input['certification_id'] ?? ''));
$courseTitle = trim($input['course_title'] ?? $input['course_name'] ?? 'Professional Credential');
$score = isset($input['score']) ? (float)$input['score'] : 10.0;
$totalQuestions = isset($input['total_questions']) ? (int)$input['total_questions'] : (isset($input['total']) ? (int)$input['total'] : 10);
$percentage = isset($input['percentage']) ? (float)$input['percentage'] : 100.0;
$certificateUrl = $uploadedPdfUrl ?: trim($input['certificate_url'] ?? $input['pdf_path'] ?? '');
$status = trim($input['status'] ?? 'valid');
$verificationStatus = trim($input['verification_status'] ?? 'Valid');
$issueDate = trim($input['issue_date'] ?? $input['issued_at'] ?? date('Y-m-d H:i:s'));

// If student name missing, try looking up user table
if (empty($studentName) && $userId) {
    $uStmt = $db->prepare("SELECT first_name, last_name, email FROM users WHERE id = ? LIMIT 1");
    if ($uStmt) {
        $uStmt->bind_param("i", $userId);
        $uStmt->execute();
        $uRes = $uStmt->get_result();
        if ($uRow = $uRes->fetch_assoc()) {
            $studentName = trim(($uRow['first_name'] ?? '') . ' ' . ($uRow['last_name'] ?? ''));
            if (empty($studentEmail) && !empty($uRow['email'])) {
                $studentEmail = $uRow['email'];
            }
        }
        $uStmt->close();
    }
}

if (empty($studentName)) {
    $studentName = 'Verified Learner';
}
$studentName = strtoupper($studentName);

if (empty($studentEmail)) {
    $studentEmail = 'certified@broadbeachonline.com';
}

// Generate unique certificate code if none supplied
if (empty($certCode)) {
    $codePrefix = '26BB';
    $randomSeq = str_pad((string)mt_rand(10000, 99999), 5, '0', STR_PAD_LEFT);
    $certCode = $codePrefix . $randomSeq;
}
$certNumber = $certCode;

// 5. Duplicate Check:
// Ensure duplicate certificates aren't created for the same user and course
$existingId = null;
if ($userId && !empty($courseId)) {
    $dupStmt = $db->prepare("SELECT id, certificate_code, certificate_number, issue_date, created_at FROM certificates WHERE (user_id = ? AND course_id = ?) OR certificate_code = ? OR certificate_number = ? LIMIT 1");
    if ($dupStmt) {
        $dupStmt->bind_param("isss", $userId, $courseId, $certCode, $certCode);
        $dupStmt->execute();
        $dupRes = $dupStmt->get_result();
        if ($dupRow = $dupRes->fetch_assoc()) {
            $existingId = (int)$dupRow['id'];
            $certCode = $dupRow['certificate_code'] ?: $dupRow['certificate_number'];
            $certNumber = $certCode;
        }
        $dupStmt->close();
    }
} else {
    $dupStmt = $db->prepare("SELECT id, certificate_code, certificate_number FROM certificates WHERE certificate_code = ? OR certificate_number = ? LIMIT 1");
    if ($dupStmt) {
        $dupStmt->bind_param("ss", $certCode, $certCode);
        $dupStmt->execute();
        $dupRes = $dupStmt->get_result();
        if ($dupRow = $dupRes->fetch_assoc()) {
            $existingId = (int)$dupRow['id'];
        }
        $dupStmt->close();
    }
}

try {
    if ($existingId) {
        // Update existing certificate
        $updSql = "UPDATE certificates SET 
            student_name = ?,
            student_email = ?,
            course_title = ?,
            score = ?,
            total_questions = ?,
            percentage = ?,
            certificate_url = COALESCE(NULLIF(?, ''), certificate_url),
            pdf_path = COALESCE(NULLIF(?, ''), pdf_path),
            status = ?,
            verification_status = ?,
            updated_at = NOW()
            WHERE id = ?";
        $stmt = $db->prepare($updSql);
        if (!$stmt) {
            throw new Exception("Prepare update failed: " . $db->error);
        }
        $stmt->bind_param(
            "sssddissssi",
            $studentName,
            $studentEmail,
            $courseTitle,
            $score,
            $totalQuestions,
            $percentage,
            $certificateUrl,
            $certificateUrl,
            $status,
            $verificationStatus,
            $existingId
        );
        $stmt->execute();
        $stmt->close();
        $recordId = $existingId;
        $isNew = false;
    } else {
        // Insert brand new certificate
        $insSql = "INSERT INTO certificates (
            certificate_code,
            certificate_number,
            user_id,
            student_name,
            student_email,
            course_id,
            course_title,
            score,
            total_questions,
            percentage,
            issue_date,
            issued_at,
            certificate_url,
            pdf_path,
            status,
            verification_status,
            source,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'online', NOW(), NOW())";

        $stmt = $db->prepare($insSql);
        if (!$stmt) {
            throw new Exception("Prepare insert failed: " . $db->error);
        }

        $stmt->bind_param(
            "ssissssddissssss",
            $certCode,
            $certNumber,
            $userId,
            $studentName,
            $studentEmail,
            $courseId,
            $courseTitle,
            $score,
            $totalQuestions,
            $percentage,
            $issueDate,
            $issueDate,
            $certificateUrl,
            $certificateUrl,
            $status,
            $verificationStatus
        );

        if (!$stmt->execute()) {
            throw new Exception("Execute insert failed: " . $stmt->error);
        }

        $recordId = $db->insert_id;
        $stmt->close();
        $isNew = true;
    }

    // Return the authoritative record
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
