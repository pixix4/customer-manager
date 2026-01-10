CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE customer (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address_street TEXT NOT NULL,
    address_city TEXT NOT NULL,
    phone TEXT NOT NULL,
    mobile_phone TEXT NOT NULL,
    birthdate DATE,
    customer_since DATE,
    note TEXT NOT NULL,
    responsible_employee_id INTEGER,
    CONSTRAINT fk_responsible_employee FOREIGN KEY (responsible_employee_id) REFERENCES employee (id) ON DELETE SET NULL
);