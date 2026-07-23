<?php
// Configure the receiving address before deploying.
$recipient = 'estimates@evergreenedgelawn.com';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method not allowed.'); }
function clean($value) { return trim(strip_tags((string)$value)); }
if (!empty($_POST['website'])) { http_response_code(400); exit('Unable to process this request.'); }
$required = ['first_name','last_name','phone','email','consent'];
if (strlen($_SERVER['CONTENT_LENGTH'] ?? '0') > 50000) { http_response_code(413); exit('Request is too large.'); }
foreach ($required as $field) { if (empty($_POST[$field])) { http_response_code(400); exit('Please return to the form and complete all required fields.'); } }
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
if (!$email || strlen($email) > 254) { http_response_code(400); exit('Please provide a valid email address.'); }
$phone = preg_replace('/[^0-9]/', '', $_POST['phone']);
if (strlen($phone) < 10 || strlen($phone) > 15) { http_response_code(400); exit('Please provide a valid phone number.'); }
if (isset($_POST['zip']) && $_POST['zip'] !== '' && !preg_match('/^\d{5}$/', $_POST['zip'])) { http_response_code(400); exit('Please provide a valid ZIP code.'); }
$fields = ['first_name','last_name','phone','email','address','city','zip','property_type','services','frequency','size','condition','start_date','contact_method','contact_time','message','consent'];
$lines = [];
foreach ($fields as $field) { $value = clean($_POST[$field] ?? ''); if (strlen($value) > 2000) { http_response_code(400); exit('One of the submitted fields is too long.'); } $lines[] = ucfirst(str_replace('_', ' ', $field)).': '.$value; }
$lines[] = 'Submitted at: '.gmdate('c');
$subject = 'New Evergreen Edge estimate request';
$headers = "From: Website Form <no-reply@evergreenedgelawn.com>
Reply-To: $email
Content-Type: text/plain; charset=UTF-8";
if (mail($recipient, $subject, implode("
", $lines), $headers)) { header('Location: thank-you.html', true, 303); exit; }
http_response_code(500); exit('We could not send your request. Please call (561) 555-0187 or email estimates@evergreenedgelawn.com.');
