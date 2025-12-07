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
    username VARCHAR(50) NOT NULL,
    adminpw VARCHAR(50) NOT NULL
);

CREATE TABLE teams(
    teamid INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    -- hometown VARCHAR(100) NOT NULL
);

CREATE TABLE matches(
    macthid INT AUTO_INCREMENT PRIMARY KEY,
    team_a_id INT NOT NULL,
    team_b_id INT NOT NULL,
    match_date DATETIME NOT NULL,
    match_status ENUM('Upcoming','Ongoing','Completed') DEFAULT 'Upcoming',
    winner_id INT DEFAULT NULL,
    FOREIGN KEY (team_a_id) REFERENCES teams(teamid), -- refers to team's table id
    FOREIGN KEY (team_b_id) REFERENCES teams(teamid),
    FOREIGN KEY (winner_id) REFERENCES teams(teamid)
);

CREATE TABLE scores(
    scoreid INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    total_wins INT DEFAULT 0,
    total_losses INT DEFAULT 0,
    last_match_score INT DEFAULT 0,
    FOREIGN KEY (team_id) REFERENCES teams(teamid)
);
