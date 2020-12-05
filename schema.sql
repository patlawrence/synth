CREATE DATABASE synth;

CREATE TABLE configs (
    guildId CHAR(18) NOT NULL PRIMARY KEY,
    prefix CHAR(10) DEFAULT '!',
    color CHAR(7) DEFAULT '#FFFFFF'
);

CREATE TABLE highlights (
    guildId CHAR(18) NOT NULL,
    FOREIGN KEY (guildId) REFERENCES configs(guildId),
    emoji CHAR(47) DEFAULT ':heart:',
    channel CHAR(18) NOT NULL
);