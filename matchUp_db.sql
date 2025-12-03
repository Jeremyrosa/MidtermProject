CREATE DATABASE Match_Up;

USE Match_Up;

CREATE TABLE users(
    userid INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL,
    user_pw VARCHAR(50) NOT NULL
);

CREATE TABLE teams(
    teamid INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL,
    home_city VARCHAR(100) NOT NULL
);

CREATE TABLE matches(
    macthid INT AUTO_INCREMENT PRIMARY KEY,
    team_a VARCHAR(50) NOT NULL,
    team_b VARCHAR(50) NOT NULL,
    match_date DATETIME NOT NULL,
    match_status VARCHAR(50) ENUM('Upcoming','Ongoing','Completed') DEFAULT 'Upcoming'
    winner INT DEFAULT NULL,
    FOREIGN KEY (team_a_id) REFERENCES teams(teamid), -- refers to team's table id
    FOREIGN KEY (team_b_id) REFERENCES teams(teamid),
    FOREIGN KEY (winner_id) REFERENCES teams(teamid)
);

