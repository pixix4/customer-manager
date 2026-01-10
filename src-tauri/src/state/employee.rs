use sqlx::{Pool, Sqlite};
use std::sync::Arc;

use crate::{
    error::ServiceResult,
    model::{EditEmployeeDto, EmployeeDto},
};

#[derive(Clone)]
pub struct EmployeeState {
    pool: Arc<Pool<Sqlite>>,
}

impl EmployeeState {
    pub fn new(pool: Arc<Pool<Sqlite>>) -> Self {
        Self { pool }
    }

    pub async fn get_employee_list(&self) -> ServiceResult<Vec<EmployeeDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        Ok(sqlx::query_as::<_, EmployeeRow>(
            r#"
            SELECT e.id, e.name FROM employee e;
        "#,
        )
        .fetch_all(connection.as_mut())
        .await?
        .into_iter()
        .map(|row| row.into())
        .collect())
    }

    pub async fn get_employee_by_id(&self, id: i64) -> ServiceResult<Option<EmployeeDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        Ok(sqlx::query_as::<_, EmployeeRow>(
            r#"
            SELECT e.id, e.name FROM employee e
            WHERE e.id = $1;
        "#,
        )
        .bind(id)
        .fetch_optional(connection.as_mut())
        .await?
        .map(|row| row.into()))
    }

    pub async fn store_employee(&self, employee: EditEmployeeDto) -> ServiceResult<i64> {
        let mut connection = self.pool.acquire().await.unwrap();

        let q = if let Some(employee_id) = employee.id {
            sqlx::query(
                r#"
                UPDATE employee
                SET name = $2
                WHERE id = $1;
            "#,
            )
            .bind(employee_id)
        } else {
            sqlx::query(
                r#"
                INSERT INTO employee (name)
                VALUES ($1);
            "#,
            )
        };

        q.bind(&employee.name).execute(connection.as_mut()).await?;

        if let Some(employee_id) = employee.id {
            return Ok(employee_id);
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

    pub async fn delete_employee(&self, id: i64) -> ServiceResult<()> {
        let mut connection = self.pool.acquire().await.unwrap();

        sqlx::query(
            r#"
                DELETE FROM employee
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
struct EmployeeRow {
    pub id: i64,
    pub name: String,
}

impl Into<EmployeeDto> for EmployeeRow {
    fn into(self) -> EmployeeDto {
        EmployeeDto {
            id: self.id,
            name: self.name,
        }
    }
}
