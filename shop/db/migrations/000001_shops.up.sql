CREATE TABLE products (
    plu VARCHAR(255) PRIMARY KEY UNIQUE,
    product VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE shops (
    id VARCHAR(255) PRIMARY KEY UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE shelfs (
    products_plu VARCHAR(255),
    shops_id VARCHAR(255),
    shelfs INT,
    CONSTRAINT products_shops_id PRIMARY KEY (products_plu, shops_id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY UNIQUE,
    count INT,
    completed BOOLEAN,
    products_plu VARCHAR(255) REFERENCES products (plu) ON DELETE CASCADE NOT NULL,
    shops_id VARCHAR(255) REFERENCES shops (id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP
);
