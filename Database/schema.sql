CREATE DATABASE synth DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;

CREATE USER ubuntu@localhost IDENTIFIED BY 'nuQ9@3y!2GY4';

GRANT SELECT, INSERT, UPDATE, DELETE, ALTER ON synth.* TO ubuntu@localhost;

USE synth;

CREATE TABLE configs (
    guildID CHAR(20) NOT NULL PRIMARY KEY,
    prefix CHAR(47) DEFAULT '!',
    color CHAR(7) DEFAULT '#FFFFFF'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE highlightsConfigs (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    emoji CHAR(47),
    channel CHAR(23),
    requiredToCreate SMALLINT(5) UNSIGNED DEFAULT 3,
    requiredToDelete SMALLINT(5) UNSIGNED DEFAULT 2
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE levelsConfigs (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID),
    gainRate FLOAT(3, 2) DEFAULT 1,
    doRankUpAlert BOOLEAN DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE levelsPoints (
    guildID CHAR(20) NOT NULL,
    userID CHAR(20) NOT NULL,
    `rank` TINYINT(3) UNSIGNED DEFAULT 1,
    experience TINYINT(6) UNSIGNED DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE levelsRoles (
    guildID CHAR(20) NOT NULL,
    FOREIGN KEY (guildID) REFERENCES configs(guildID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
