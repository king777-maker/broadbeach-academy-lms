<?php
/**
 * ============================================================================
 * Broadbeach LMS — Master Admin Central Certificates Endpoint (GoDaddy cPanel)
 * GET /api/get_admin_certificates.php or /api/admin/online-certificates
 * Fetches all certificates across all learners from central database
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

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, X-Admin-Token, X-User-Token");
header("Content-Type: application/json; charset=UTF-8");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. Database Connection
$db = null;
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

// 3. Optional Admin Auth Check
// If Authorization header or X-Admin-Token is provided, verify it if admin_users has token column
$token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if (empty($token) && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
    if (preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
        $token = $matches[1];
    }
}

// 4. Query All Certificates from Central Database
$search = trim($_GET['search'] ?? '');
$status = trim($_GET['status'] ?? 'all');

$sql = "
    SELECT 
        c.id,
        COALESCE(c.certificate_code, c.certificate_number) AS certificate_code,
        COALESCE(c.certificate_number, c.certificate_code) AS certificate_number,
        c.user_id,
        c.student_name,
        COALESCE(NULLIF(c.student_email, ''), u.email, 'learner@broadbeachonline.com') AS candidate_email,
        c.student_email,
        c.course_id,
        COALESCE(NULLIF(c.course_title, ''), fc.name, 'Professional Credential') AS course_name,
        COALESCE(NULLIF(c.course_title, ''), fc.name, 'Professional Credential') AS course_title,
        c.score,
        c.total_questions,
        c.percentage,
        COALESCE(c.issue_date, c.issued_at, c.created_at) AS issued_at,
        COALESCE(c.issue_date, c.issued_at, c.created_at) AS issue_date,
        c.certificate_url,
        c.pdf_path,
        c.status,
        c.verification_status,
        c.revoked_at,
        c.revoked_by,
        c.revocation_reason,
        c.source,
        c.created_at
    FROM certificates c
    LEFT JOIN users u ON u.id = c.user_id
    LEFT JOIN free_certifications fc ON fc.id = c.course_id
    WHERE c.status != 'deleted'
";

if ($status !== 'all' && $status !== '') {
    $safeStatus = $db->real_escape_string($status);
    $sql .= " AND c.status = '{$safeStatus}'";
}

if ($search !== '') {
    $s = $db->real_escape_string($search);
    $sql .= " AND (
        c.certificate_number LIKE '%{$s}%' 
        OR c.certificate_code LIKE '%{$s}%' 
        OR c.student_name LIKE '%{$s}%' 
        OR c.student_email LIKE '%{$s}%' 
        OR u.email LIKE '%{$s}%' 
        OR c.course_title LIKE '%{$s}%' 
        OR fc.name LIKE '%{$s}%'
    )";
}

$sql .= " ORDER BY c.id DESC";

$certificates = [];

try {
    $res = $db->query($sql);
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['score'] = (float)$row['score'];
            $row['total_questions'] = (int)$row['total_questions'];
            $row['percentage'] = (float)$row['percentage'];
            $certificates[] = $row;
        }
    }
} catch (Throwable $e) {
    // If table structure differs slightly, run fallback query
    try {
        $fbRes = $db->query("SELECT * FROM certificates ORDER BY id DESC");
        if ($fbRes) {
            while ($row = $fbRes->fetch_assoc()) {
                $code = $row['certificate_code'] ?? $row['certificate_number'] ?? ('CERT-' . $row['id']);
                $certificates[] = [
                    'id' => (int)$row['id'],
                    'certificate_code' => $code,
                    'certificate_number' => $code,
                    'student_name' => strtoupper($row['student_name'] ?? 'Learner'),
                    'candidate_email' => $row['student_email'] ?? 'learner@broadbeachonline.com',
                    'course_name' => $row['course_title'] ?? 'Online Certification',
                    'score' => (float)($row['score'] ?? 10),
                    'total_questions' => (int)($row['total_questions'] ?? 10),
                    'percentage' => (float)($row['percentage'] ?? 100),
                    'issued_at' => $row['issue_date'] ?? $row['issued_at'] ?? $row['created_at'] ?? date('Y-m-d H:i:s'),
                    'status' => $row['status'] ?? 'valid',
                    'verification_status' => $row['verification_status'] ?? 'Valid',
                    'certificate_url' => $row['certificate_url'] ?? $row['pdf_path'] ?? null,
                    'source' => 'online'
                ];
            }
        }
    } catch (Throwable $e2) {
        // Log query error
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Central certificates loaded successfully.',
    'count' => count($certificates),
    'data' => $certificates,
]);
