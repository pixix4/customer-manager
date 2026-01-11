use std::fs::File;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::{env, fs};

use customer::CustomerState;
use employee::EmployeeState;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Sqlite};

use crate::state::appointment::AppointmentState;

mod appointment;
mod customer;
mod employee;

#[derive(Clone)]
pub struct State {
    _pool: Arc<Pool<Sqlite>>,
    pub employee: EmployeeState,
    pub customer: CustomerState,
    pub appointment: AppointmentState,
}

impl State {
    pub async fn new() -> Self {
        let path = get_file_path("../customer-manager.db");

        ensure_db_file_exists(&path);

        let db_pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&format!("sqlite:{}", path))
            .await
            .unwrap();

        sqlx::migrate!().run(&db_pool).await.unwrap();
        let pool = Arc::new(db_pool);

        let employee = EmployeeState::new(pool.clone());
        let customer = CustomerState::new(pool.clone());
        let appointment = AppointmentState::new(pool.clone());

        Self {
            _pool: pool,
            employee,
            customer,
            appointment,
        }
    }
}

fn get_file_path(path: &str) -> String {
    // Define a relative path
    let relative_path = PathBuf::from(path);

    // Convert to an absolute path
    let absolute_path = if relative_path.is_absolute() {
        relative_path
    } else {
        env::current_dir().unwrap().join(relative_path)
    };

    // Normalize the path by removing redundant components like ".." and "."
    let normalized_path: PathBuf = absolute_path.components().collect();

    // Convert the absolute path to a String
    normalized_path.to_string_lossy().into_owned()
}

fn ensure_db_file_exists(path: &str) {
    // Get the parent directory of the file
    if let Some(parent) = Path::new(path).parent() {
        // Check if the parent directory exists
        if !parent.exists() {
            // Create the parent directory if it doesn't exist
            match fs::create_dir_all(parent) {
                Ok(_) => println!("Created parent directories: {:?}", parent),
                Err(e) => println!("Failed to create parent directories: {}", e),
            }
        }
    }

    // Check if the file exists and create it if it doesn't
    if Path::new(path).exists() {
        println!("File exists: {}", path);
    } else {
        match File::create(path) {
            Ok(_) => println!("Created an empty file: {}", path),
            Err(e) => println!("Failed to create the file: {}", e),
        }
    }
}
