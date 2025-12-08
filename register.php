<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"]);
$username = trim($data["username"]);
$password = trim($data["password"]);

$conn = new mysqli("localhost", "root", "", "Match_Up");



$stmt->close();
$conn->close();
?>
