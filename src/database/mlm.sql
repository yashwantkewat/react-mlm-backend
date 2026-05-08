-- =========================
-- USERS TABLE
-- =========================
-- Stores all users and admins

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- user basic details
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),

    -- MLM referral system
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(20),

    -- role management
    role ENUM('user','admin')
    DEFAULT 'user',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- WALLET TABLE
-- =========================
-- Stores user earnings balance

CREATE TABLE wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNIQUE,

    balance DECIMAL(10,2)
    DEFAULT 0,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);



-- =========================
-- TRANSACTIONS TABLE
-- =========================
-- Stores all wallet transactions

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    amount DECIMAL(10,2),

    type ENUM('credit','debit'),

    level INT,

    description VARCHAR(255),

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);



-- =========================
-- REFERRAL TREE TABLE
-- =========================
-- Stores MLM hierarchy

CREATE TABLE referral_tree (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    parent_id INT,

    level INT,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (parent_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);



-- =========================
-- COMMISSION SETTINGS TABLE
-- =========================
-- Stores MLM commission levels

CREATE TABLE commission_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    level INT UNIQUE,

    amount DECIMAL(10,2)
);



-- =========================
-- KYC TABLE
-- =========================
-- Stores user KYC details

CREATE TABLE kyc (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNIQUE,

    document_type VARCHAR(100),

    document_number VARCHAR(255),

    document_image VARCHAR(255),

    status ENUM(
        'pending',
        'approved',
        'rejected'
    )
    DEFAULT 'pending',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);