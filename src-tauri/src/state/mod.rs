use std::fs::{self, File};
use std::path::{Path, PathBuf};
use std::sync::Arc;

use log::info;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Sqlite};

use crate::state::appointment::AppointmentState;
use crate::state::customer::CustomerState;
use crate::state::employee::EmployeeState;
use crate::state::preference::PreferenceState;

mod appointment;
mod customer;
mod employee;
mod preference;

#[derive(Clone)]
pub struct State {
    _pool: Arc<Pool<Sqlite>>,
    pub db_path: PathBuf,
    pub employee: EmployeeState,
    pub customer: CustomerState,
    pub appointment: AppointmentState,
    pub preference: PreferenceState,
}

impl State {
    pub async fn new(app_data_dir: &Path) -> Self {
        fs::create_dir_all(app_data_dir).expect("failed to create app data dir");

        let db_path = app_data_dir.join("data.db");
        info!("Using database file {:?}", db_path);

        if !db_path.exists() {
            File::create(&db_path).unwrap();
        }

        let db_pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&format!("sqlite:{}", db_path.display()))
            .await
            .unwrap();

        sqlx::migrate!().run(&db_pool).await.unwrap();
        let pool = Arc::new(db_pool);

        let employee = EmployeeState::new(pool.clone());
        let customer = CustomerState::new(pool.clone());
        let appointment = AppointmentState::new(pool.clone());
        let preference = PreferenceState::new(pool.clone());

        Self {
            _pool: pool,
            db_path,
            employee,
            customer,
            appointment,
            preference,
        }
    }
}
