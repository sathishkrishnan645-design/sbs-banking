CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    customer_id   VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100),
    status        VARCHAR(20) DEFAULT 'ACTIVE',
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
    id             SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id    VARCHAR(20) NOT NULL,
    account_type   VARCHAR(20) DEFAULT 'SAVINGS',
    balance        DECIMAL(15,2) DEFAULT 0.00,
    created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id             SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    type           VARCHAR(10) NOT NULL,
    amount         DECIMAL(15,2) NOT NULL,
    description    VARCHAR(255),
    created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans (
    id             SERIAL PRIMARY KEY,
    customer_id    VARCHAR(20) NOT NULL,
    amount         DECIMAL(15,2) NOT NULL,
    tenure_months  INT NOT NULL,
    emi            DECIMAL(10,2) NOT NULL,
    status         VARCHAR(20) DEFAULT 'APPLIED',
    created_at     TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (customer_id, password_hash, full_name, email)
VALUES ('CUS001',
        '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36FMGGBEHy1y1CKN/D5sdKu',
        'Sathish Krishnan', 'sathish155@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO accounts (account_number, customer_id, account_type, balance)
VALUES ('ACC001001', 'CUS001', 'SAVINGS', 85420.50),
       ('ACC001002', 'CUS001', 'CURRENT', 210000.00)
ON CONFLICT DO NOTHING;

INSERT INTO transactions (account_number, type, amount, description)
VALUES ('ACC001001', 'CREDIT', 25000, 'Salary credit April 2026'),
       ('ACC001001', 'DEBIT',  4500,  'NEFT transfer to ACC002001'),
       ('ACC001001', 'DEBIT',  1200,  'Bill payment Electricity');
