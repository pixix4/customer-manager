use chrono::NaiveDate;
use sqlx::{Pool, Sqlite};
use std::sync::Arc;

use crate::{
    error::ServiceResult,
    model::{CustomerDto, EditCustomerDto, EmployeeDto},
};

#[derive(Clone)]
pub struct CustomerState {
    pool: Arc<Pool<Sqlite>>,
}

impl CustomerState {
    pub fn new(pool: Arc<Pool<Sqlite>>) -> Self {
        Self { pool }
    }

    pub async fn get_customer_list(&self) -> ServiceResult<Vec<CustomerDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        Ok(sqlx::query_as::<_, CustomerRow>(
            r#"
            SELECT 
                c.id,
                c.title,
                c.first_name,
                c.last_name,
                c.address_street,
                c.address_city,
                c.phone,
                c.mobile_phone,
                c.birthdate,
                c.customer_since,
                c.note,
                e.id AS responsible_employee_id,
                e.name AS responsible_employee_name
            FROM customer c
            LEFT JOIN employee e ON c.responsible_employee_id = e.id;
        "#,
        )
        .fetch_all(connection.as_mut())
        .await?
        .into_iter()
        .map(|row| row.into())
        .collect())
    }

    pub async fn get_customer_by_id(&self, id: i64) -> ServiceResult<Option<CustomerDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        Ok(sqlx::query_as::<_, CustomerRow>(
            r#"
            SELECT 
                c.id,
                c.title,
                c.first_name,
                c.last_name,
                c.address_street,
                c.address_city,
                c.phone,
                c.mobile_phone,
                c.birthdate,
                c.customer_since,
                c.note,
                e.id AS responsible_employee_id,
                e.name AS responsible_employee_name
            FROM customer c
            LEFT JOIN employee e ON c.responsible_employee_id = e.id
            WHERE c.id = $1;
        "#,
        )
        .bind(id)
        .fetch_optional(connection.as_mut())
        .await?
        .map(|row| row.into()))
    }

    pub async fn store_customer(&self, customer: EditCustomerDto) -> ServiceResult<i64> {
        let mut connection = self.pool.acquire().await.unwrap();

        let q = if let Some(customer_id) = customer.id {
            sqlx::query(
                r#"
                UPDATE customer
                SET title = $2,
                    first_name = $3,
                    last_name = $4,
                    address_street = $5,
                    address_city = $6,
                    phone = $7,
                    mobile_phone = $8,
                    birthdate = $9,
                    customer_since = $10,
                    note = $11,
                    responsible_employee_id = $12
                WHERE id = $1;
            "#,
            )
            .bind(customer_id)
        } else {
            sqlx::query(
                r#"
                INSERT INTO customer (
                    title,
                    first_name,
                    last_name,
                    address_street,
                    address_city,
                    phone,
                    mobile_phone,
                    birthdate,
                    customer_since,
                    note,
                    responsible_employee_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
            "#,
            )
        };

        q.bind(&customer.title)
            .bind(&customer.first_name)
            .bind(&customer.last_name)
            .bind(&customer.address_street)
            .bind(&customer.address_city)
            .bind(&customer.phone)
            .bind(&customer.mobile_phone)
            .bind(&customer.birthdate)
            .bind(&customer.customer_since)
            .bind(&customer.note)
            .bind(customer.responsible_employee_id)
            .execute(connection.as_mut())
            .await?;

        if let Some(customer_id) = customer.id {
            return Ok(customer_id);
        }

        Ok(sqlx::query_as::<_, IdRow>(
            r#"
        SELECT last_insert_rowid() as id;
        "#,
        )
        .fetch_one(connection.as_mut())
        .await?
        .id)
    }

    pub async fn delete_customer(&self, id: i64) -> ServiceResult<()> {
        let mut connection = self.pool.acquire().await.unwrap();

        sqlx::query(
            r#"
                DELETE FROM customer
                WHERE id = $1;
            "#,
        )
        .bind(id)
        .execute(connection.as_mut())
        .await?;

        Ok(())
    }
}

#[derive(sqlx::FromRow)]
struct IdRow {
    pub id: i64,
}

#[derive(sqlx::FromRow)]
struct CustomerRow {
    pub id: i64,
    pub title: String,
    pub first_name: String,
    pub last_name: String,
    pub address_street: String,
    pub address_city: String,
    pub phone: String,
    pub mobile_phone: String,
    pub birthdate: Option<NaiveDate>,
    pub customer_since: Option<NaiveDate>,
    pub note: String,
    pub responsible_employee_id: Option<i64>,
    pub responsible_employee_name: Option<String>,
}

impl Into<CustomerDto> for CustomerRow {
    fn into(self) -> CustomerDto {
        let responsible_employee =
            match (self.responsible_employee_id, self.responsible_employee_name) {
                (Some(id), Some(name)) => Some(EmployeeDto { id, name }),
                _ => None,
            };

        CustomerDto {
            id: self.id,
            title: self.title,
            first_name: self.first_name,
            last_name: self.last_name,
            address_street: self.address_street,
            address_city: self.address_city,
            phone: self.phone,
            mobile_phone: self.mobile_phone,
            birthdate: self.birthdate,
            customer_since: self.customer_since,
            note: self.note,
            responsible_employee,
        }
    }
}
