CREATE DATABASE IF NOT EXISTS Music;
CREATE TABLE IF NOT EXISTS Music.feedback
(
userID varchar(36),
userIP varchar(45),
timestamp timestamp,
questionID varchar(64),
rating int,
comment text,
CONSTRAINT pk_userquestion PRIMARY KEY (userID,questionID)
);
