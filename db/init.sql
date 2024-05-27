-- Create the database
CREATE DATABASE toddledb;

-- create tables
CREATE TABLE users (
    username VARCHAR(50) UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    postType VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followtable (
    following VARCHAR(50) NOT NULL,
    followedby VARCHAR(50) NOT NULL,
    PRIMARY KEY (following, followedby),
    FOREIGN KEY (following) REFERENCES users(username),
    FOREIGN KEY (followedby) REFERENCES users(username)
);

CREATE TABLE likes (
    postid INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (postid, username),
    FOREIGN KEY (postid) REFERENCES posts(postid),
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE comments (
    commentid SERIAL PRIMARY KEY,
    postid INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postid) REFERENCES posts(postid),
    FOREIGN KEY (username) REFERENCES users(username)
);


