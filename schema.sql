CREATE DATABASE synth;

CREATE TABLE configs (
    guildID CHAR(18) NOT NULL PRIMARY KEY,
    prefix CHAR(10) DEFAULT '!',
    color CHAR(7) DEFAULT '#FFFFFF'
);

CREATE TABLE highlights (
    guildID CHAR(18) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    emoji CHAR(47) DEFAULT ':heart:',
    channelID CHAR(18) NOT NULL
);