use chrono::{Duration, NaiveDateTime};
use sqlx::{Pool, Sqlite};
use std::sync::Arc;

use crate::{
    error::ServiceResult,
    model::{CustomerAppointmentDto, EditCustomerAppointmentDto, EmployeeDto},
};

#[derive(Clone)]
pub struct AppointmentState {
    pool: Arc<Pool<Sqlite>>,
}

impl AppointmentState {
    pub fn new(pool: Arc<Pool<Sqlite>>) -> Self {
        Self { pool }
    }

    pub async fn get_appointment_list(
        &self,
        customer_id: i64,
    ) -> ServiceResult<Vec<CustomerAppointmentDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        let mut appointments: Vec<CustomerAppointmentDto> = sqlx::query_as::<_, AppointmentRow>(
            r#"
            SELECT 
                a.id,
                a.customer_id,
                a.number,
                a.start_date,
                a.duration_minutes,
                a.treatment,
                e.id AS employee_id,
                e.name AS employee_name
            FROM appointment a
            LEFT JOIN employee e ON a.employee_id = e.id
            WHERE a.customer_id = $1
            ORDER BY a.start_date ASC;
        "#,
        )
        .bind(customer_id)
        .fetch_all(connection.as_mut())
        .await?
        .into_iter()
        .map(|row| row.into())
        .collect();

        let mut last_start_date: Option<NaiveDateTime> = None;
        for appointment in &mut appointments {
            let duration = Duration::minutes(appointment.duration_minutes);
            appointment.end_date = appointment.start_date + duration;

            if let Some(last_start_date) = last_start_date {
                let delta = appointment.start_date - last_start_date;
                appointment.period_days = Some(delta.num_days())
            }

            last_start_date = Some(appointment.start_date)
        }

        appointments.reverse();
        Ok(appointments)
    }

    pub async fn get_appointment_by_id(
        &self,
        id: i64,
    ) -> ServiceResult<Option<CustomerAppointmentDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        Ok(sqlx::query_as::<_, AppointmentRow>(
            r#"
            SELECT 
                a.id,
                a.customer_id,
                a.number,
                a.start_date,
                a.duration_minutes,
                a.treatment,
                e.id AS employee_id,
                e.name AS employee_name
            FROM appointment a
            LEFT JOIN employee e ON a.employee_id = e.id
            WHERE a.id = $1;
        "#,
        )
        .bind(id)
        .fetch_optional(connection.as_mut())
        .await?
        .map(|row| row.into()))
    }

    pub async fn store_appointment(
        &self,
        appointment: EditCustomerAppointmentDto,
    ) -> ServiceResult<i64> {
        let mut connection = self.pool.acquire().await.unwrap();

        let q = if let Some(appointment_id) = appointment.id {
            sqlx::query(
                r#"
                UPDATE appointment
                SET customer_id = $2,
                    start_date = $3,
                    duration_minutes = $4,
                    treatment = $5,
                    employee_id = $6
                WHERE id = $1;
            "#,
            )
            .bind(appointment_id)
        } else {
            let number = sqlx::query_as::<_, NumberRow>(
                r#"
            SELECT a.number
            FROM appointment a
            WHERE a.customer_id = $1
            ORDER BY number DESC
            LIMIT 1;
            "#,
            )
            .bind(appointment.customer_id)
            .fetch_optional(connection.as_mut())
            .await?
            .unwrap_or_default();

            sqlx::query(
                r#"
                INSERT INTO appointment (
                    number,
                    customer_id,
                    start_date,
                    duration_minutes,
                    treatment,
                    employee_id
                )
                VALUES ($1, $2, $3, $4, $5, $6);
            "#,
            )
            .bind(number.number + 1)
        };

        q.bind(appointment.customer_id)
            .bind(appointment.start_date)
            .bind(appointment.duration_minutes)
            .bind(&appointment.treatment)
            .bind(appointment.employee_id)
            .execute(connection.as_mut())
            .await?;

        if let Some(appointment_id) = appointment.id {
            return Ok(appointment_id);
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

    pub async fn delete_appointment(&self, id: i64) -> ServiceResult<()> {
        let mut connection = self.pool.acquire().await.unwrap();

        sqlx::query(
            r#"
                DELETE FROM appointment
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

#[derive(sqlx::FromRow, Default)]
struct NumberRow {
    pub number: i64,
}

#[derive(sqlx::FromRow)]
struct AppointmentRow {
    pub id: i64,
    pub customer_id: i64,
    pub number: i64,
    pub start_date: NaiveDateTime,
    pub duration_minutes: i64,
    pub treatment: String,
    pub employee_id: Option<i64>,
    pub employee_name: Option<String>,
}

impl From<AppointmentRow> for CustomerAppointmentDto {
    fn from(row: AppointmentRow) -> CustomerAppointmentDto {
        let employee = match (row.employee_id, row.employee_name) {
            (Some(id), Some(name)) => Some(EmployeeDto { id, name }),
            _ => None,
        };

        CustomerAppointmentDto {
            id: row.id,
            customer_id: row.customer_id,
            number: row.number,
            start_date: row.start_date,
            duration_minutes: row.duration_minutes,
            end_date: row.start_date,
            period_days: None,
            treatment: row.treatment,
            employee,
        }
    }
}
