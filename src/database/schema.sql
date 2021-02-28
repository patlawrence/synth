CREATE DATABASE synth DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;

CREATE USER ubuntu@localhost IDENTIFIED BY 'your_password_here';

GRANT SELECT, INSERT, UPDATE, DELETE, ALTER ON synth.* TO ubuntu@localhost;

USE synth;

CREATE TABLE configs (
    guildID CHAR(20) NOT NULL PRIMARY KEY,
    prefix CHAR(47) DEFAULT '-synth',
    color CHAR(7) DEFAULT '#FC8800'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE highlightsConfigs (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    emoji CHAR(47),
    channel CHAR(23),
    requiredToCreate SMALLINT(5) UNSIGNED DEFAULT 3,
    requiredToDelete SMALLINT(5) UNSIGNED DEFAULT 2
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE pointsConfigs (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    gainRate FLOAT(3, 2) DEFAULT 1,
    doLevelUpAlert BOOLEAN DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE points (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    userID CHAR(20) NOT NULL,
    PRIMARY KEY (guildID, userID),
    level TINYINT(3) UNSIGNED DEFAULT 1,
    experience TINYINT(6) UNSIGNED DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE pointsRoles (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
