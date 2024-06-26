BEGIN TRANSACTION;

CREATE TABLE tmpg (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hashed CHAR(64) NOT NULL
);

INSERT INTO tmpg SELECT * FROM users;

DROP TABLE users;

ALTER TABLE tmpg RENAME TO users;

COMMIT;