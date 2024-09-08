CREATE TABLE historyshop (
    id SERIAL PRIMARY KEY UNIQUE,
    plu VARCHAR(255),
    shops_id VARCHAR(255),
    product VARCHAR(255),
    shop VARCHAR(255),
    count INT,
    created_at TIMESTAMP,
    action VARCHAR(255)
);