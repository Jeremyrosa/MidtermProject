DROP DATABASE IF EXISTS Match_Hub;
CREATE DATABASE Match_Hub;
USE Match_Hub;

CREATE TABLE users(
    userid INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    userpw VARCHAR(300) NOT NULL
);

CREATE TABLE admin(
    adminid INT AUTO_INCREMENT PRIMARY KEY,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_username VARCHAR(50) NOT NULL UNIQUE,
    adminpw VARCHAR(50) NOT NULL
);

CREATE USER 'matchhub_user'@'localhost' INDENTIFIED BY 'secure_password';