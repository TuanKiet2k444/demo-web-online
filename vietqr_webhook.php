<?php
require_once 'connect.inc.php';

// Lấy dữ liệu POST từ VietQR Pro gửi về
$data = json_decode(file_get_contents('php://input'), true);

// Thông tin cấu hình
$checksum_key = '6bf3fe1d520762ac53f10d872480873b730538df0a82f120de401511eea5e938';

// Kiểm tra checksum (giả sử VietQR gửi trường 'checksum')
if (!isset($data['checksum'])) {
    http_response_code(400);
    echo 'Missing checksum';
    exit;
}
$expected_checksum = hash_hmac('sha256', $data['amount'] . $data['description'], $checksum_key);
if ($data['checksum'] !== $expected_checksum) {
    http_response_code(403);
    echo 'Invalid checksum';
    exit;
}

// Tìm mã đơn hàng trong nội dung chuyển khoản
$order_code = '';
if (preg_match('/don hang ([A-Z0-9]+)/i', $data['description'], $matches)) {
    $order_code = $matches[1];
}

if ($data && $data['status'] == 'success' && $order_code) {
    // Cập nhật đúng đơn hàng sang paid
    $sql = "UPDATE orders SET status='paid' WHERE order_code='$order_code' AND status='pending' LIMIT 1";
    $conn->query($sql);
}

http_response_code(200);
echo 'OK';