<?php

header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"];
$password = $data["password"];

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
    echo json_encode(["success" => false]);
    exit();
}

$stmt->bind_result($db_password);
$stmt->fetch();

if ($password === $db_password) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$stmt->close();
$conn->close();

?>