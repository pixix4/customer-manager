use chrono::{NaiveDate, NaiveDateTime};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct EmployeeDto {
    pub id: i64,
    pub name: String,
}

#[derive(Deserialize)]
pub struct EditEmployeeDto {
    pub id: Option<i64>,
    pub name: String,
}

#[derive(Serialize)]
pub struct CustomerDto {
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
    pub responsible_employee: Option<EmployeeDto>,
}

#[derive(Deserialize)]
pub struct EditCustomerDto {
    pub id: Option<i64>,
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
}

#[derive(Serialize)]
pub struct CustomerAppointmentDto {
    pub id: i64,
    pub customer_id: i64,
    pub number: i64,
    pub start_date: NaiveDateTime,
    pub duration_minutes: i64,
    pub end_date: NaiveDateTime,
    pub period_days: Option<i64>,
    pub treatment: String,
    pub price: i64,
    pub employee: Option<EmployeeDto>,
}

#[derive(Deserialize)]
pub struct EditCustomerAppointmentDto {
    pub id: Option<i64>,
    pub customer_id: i64,
    pub start_date: NaiveDateTime,
    pub duration_minutes: i64,
    pub treatment: String,
    pub price: i64,
    pub employee_id: Option<i64>,
}

#[derive(Serialize)]
pub struct PreferenceDto {
    pub key: String,
    pub value: String,
}

#[derive(Deserialize)]
pub struct EditPreferenceDto {
    pub key: String,
    pub value: Option<String>,
}
