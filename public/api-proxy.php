<?php
// api-proxy.php — يمرر /connector/* للـ backend على نفس الـ origin
// مثال: /connector/api/v1/config → https://admin.zain-elsham.com/api/v1/config

$BACKEND = 'https://admin.zain-elsham.com';

$uri  = $_SERVER['REQUEST_URI'] ?? '/';
$path = preg_replace('#^/connector/?#', '', parse_url($uri, PHP_URL_PATH) ?? '');
$qs   = $_SERVER['QUERY_STRING'] ?? '';
$target = $BACKEND . '/' . $path . ($qs ? '?' . $qs : '');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$body   = file_get_contents('php://input');

// مرر الهيدرز المهمة (auth/branch/localization/content-type)
$headers = [];
$skip = ['host','connection','content-length','accept-encoding','expect'];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $k => $v) {
        if (in_array(strtolower($k), $skip, true)) continue;
        $headers[] = $k . ': ' . $v;
    }
}

$ch = curl_init($target);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST   => $method,
    CURLOPT_HTTPHEADER      => $headers,
    CURLOPT_RETURNTRANSFER  => true,
    CURLOPT_HEADER          => true,
    CURLOPT_FOLLOWLOCATION  => false,
    CURLOPT_TIMEOUT         => 30,
    CURLOPT_SSL_VERIFYPEER  => true,
    CURLOPT_ENCODING        => '', // يقبل gzip لو الـ curl يقدر
]);
if ($body !== '' && $body !== false) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$resp = curl_exec($ch);
if ($resp === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'proxy_unreachable', 'detail' => curl_error($ch)]);
    curl_close($ch);
    exit;
}

$hsize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$code  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$rawHeaders = substr($resp, 0, $hsize);
$outBody    = substr($resp, $hsize);
curl_close($ch);

http_response_code($code ?: 502);

// مرر بس الهيدرز الآمنة من رد الـ backend
foreach (explode("\r\n", $rawHeaders) as $line) {
    if (preg_match('#^(content-type|cache-control|etag|last-modified|expires)#i', $line)) {
        header($line);
    }
}
echo $outBody;
