<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data["username"]);
$password = trim($data["password"]);

$conn = new mysqli("localhost", "root", "", "Match_Up");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection error."]);
    exit();
}

$stmt = $conn->prepare("SELECT userpw FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    $stmt = $conn->prepare("SELECT adminpw FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "User not found"]);
        exit();
    } else {
        $stmt->bind_result($db_password);
        $stmt->fetch();
    }
} else {
    $stmt->bind_result($db_password);
    $stmt->fetch();
}

$stmt->bind_result($db_password);
$stmt->fetch();

if ($password === $db_password) {
    echo json_encode(["success" => true, "message" => "Login successful."]);
} else {
    echo json_encode(["success" => false, "message" => "Incorrect password."]);
}

$stmt->close();
$conn->close();
?>