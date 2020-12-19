CREATE DATABASE synth DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;

CREATE USER 'synth'@'localhost' IDENTIFIED BY 'password';

GRANT SELECT, INSERT, UPDATE, DELETE, ALTER ON synth.* TO 'synth'@'localhost';

USE synth;

CREATE TABLE configs (
    guildID CHAR(18) NOT NULL PRIMARY KEY,
    prefix CHAR(47) DEFAULT '!',
    color CHAR(7) DEFAULT '#FFFFFF'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE highlights (
    guildID CHAR(18) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    emoji CHAR(47),
    channel CHAR(21),
    requiredToCreate SMALLINT(5) UNSIGNED DEFAULT 3,
    requiredToDelete SMALLINT(5) UNSIGNED DEFAULT 2
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;