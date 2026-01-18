CREATE TABLE appointment (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    start_date DATETIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    treatment TEXT NOT NULL,
    price INTEGER NOT NULL,
    employee_id INTEGER,
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customer (id) ON DELETE CASCADE,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employee (id) ON DELETE SET NULL
);