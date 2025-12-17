DROP DATABASE IF EXISTS Match_Up;
CREATE DATABASE Match_Up;
USE Match_Up;

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
    adminpw VARCHAR(300) NOT NULL
);

CREATE USER 'matchup_user'@'localhost' IDENTIFIED BY 'secure_password';

GRANT SELECT, INSERT, UPDATE, DELETE
ON Match_Up.*
TO 'matchup_user'@'localhost';

FLUSH PRIVILEGES;