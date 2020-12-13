CREATE DATABASE data DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;

USE data;

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
    reactionsNeeded SMALLINT(5) UNSIGNED DEFAULT 3
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;