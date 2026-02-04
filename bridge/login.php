<?php
$error = "";

// Process the login form when submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $netid = $_POST['netid'] ?? '';
    $password = $_POST['password'] ?? '';

    $payload = json_encode([
        "netid" => $netid,
        "password" => $password
    ]);

    // Make the request to Python
    $ch = curl_init('http://localhost:8000/internal/authenticate');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    ]);

    $result = curl_exec($ch);
    $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    $response = json_decode($result, true);

    if ($httpStatus === 200 && isset($response['token'])) {
        // Set the HttpOnly cookie for the browser
        setcookie("auth_token", $response['token'], [
            'expires' => time() + 3600,
            'path' => '/',
            'domain' => 'localhost',
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        // Redirect back to the React app
        header("Location: http://localhost:3000/");
        exit();
    } else {
        $error = $response['detail'] ?? "Invalid NetID or Password.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>University of Illinois | Login</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-box { background: white; padding: 40px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 350px; border-top: 5px solid #13294b; }
        h2 { color: #13294b; margin-top: 0; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px; }
        button { width: 100%; padding: 12px; background-color: #13294b; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold; }
        button:hover { background-color: #E84A27; } 
        .error-msg { color: #d9534f; background: #f2dede; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-size: 14px; }
        .hint { font-size: 12px; color: #777; margin-top: 20px; text-align: center; }
    </style>
</head>
<body>

<div class="login-box">
    <h2>U of I Login</h2>
    
    <?php if ($error): ?>
        <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <form method="POST" action="login.php">
        <label for="netid">NetID</label>
        <input type="text" id="netid" name="netid" required autofocus>
        
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
        
        <button type="submit">Log In</button>
    </form>
</div>

</body>
</html>