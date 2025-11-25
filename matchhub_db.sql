CREATE TABLE users(
    userid INT PRIMARY KEY,
    user_email VARCHAR(100),
    username VARCHAR(50),
    user_pw VARCHAR(50)
);

CREATE TABLE matches(
    matchid INT PRIMARY KEY,
    team_a VARCHAR(50),
    team_b VARCHAR(50),
    match_date DATE
);