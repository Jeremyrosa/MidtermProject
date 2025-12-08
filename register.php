<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"]);
$username = trim($data["username"]);
$password = trim($data["password"]);

$conn = new mysqli("localhost", "root", "", "Match_Up");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection error."]);
    exit();
}

$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username already taken"]);
    exit();
}

$stmt->close();

$stmt = $conn->prepare("INSERT INTO users (email, username, userpw) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $username, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registration successful."]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed. Please try again."]);
}

$stmt->close();
$conn->close();
?>
