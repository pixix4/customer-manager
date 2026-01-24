use tauri::{Manager, path::BaseDirectory};
use tauri_plugin_opener::OpenerExt;

use crate::state::State;

mod error;
mod model;
mod state;

#[tauri::command]
async fn get_employee_list(
    state: tauri::State<'_, State>,
) -> Result<Vec<model::EmployeeDto>, String> {
    state
        .inner()
        .employee
        .get_employee_list()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_employee_by_id(
    state: tauri::State<'_, State>,
    id: i64,
) -> Result<Option<model::EmployeeDto>, String> {
    state
        .inner()
        .employee
        .get_employee_by_id(id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn store_employee(
    state: tauri::State<'_, State>,
    employee: model::EditEmployeeDto,
) -> Result<i64, String> {
    state
        .inner()
        .employee
        .store_employee(employee)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_employee(state: tauri::State<'_, State>, id: i64) -> Result<(), String> {
    state
        .inner()
        .employee
        .delete_employee(id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_customer_list(
    state: tauri::State<'_, State>,
) -> Result<Vec<model::CustomerDto>, String> {
    state
        .inner()
        .customer
        .get_customer_list()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_customer_by_id(
    state: tauri::State<'_, State>,
    id: i64,
) -> Result<Option<model::CustomerDto>, String> {
    state
        .inner()
        .customer
        .get_customer_by_id(id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn store_customer(
    state: tauri::State<'_, State>,
    customer: model::EditCustomerDto,
) -> Result<i64, String> {
    state
        .inner()
        .customer
        .store_customer(customer)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_customer(state: tauri::State<'_, State>, id: i64) -> Result<(), String> {
    state
        .inner()
        .customer
        .delete_customer(id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_customer_appointment_list(
    state: tauri::State<'_, State>,
    customer_id: i64,
) -> Result<Vec<model::CustomerAppointmentDto>, String> {
    state
        .inner()
        .appointment
        .get_appointment_list(customer_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_customer_appointment_by_id(
    state: tauri::State<'_, State>,
    id: i64,
) -> Result<Option<model::CustomerAppointmentDto>, String> {
    state
        .inner()
        .appointment
        .get_appointment_by_id(id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn store_customer_appointment(
    state: tauri::State<'_, State>,
    appointment: model::EditCustomerAppointmentDto,
) -> Result<i64, String> {
    state
        .inner()
        .appointment
        .store_appointment(appointment)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_customer_appointment(
    state: tauri::State<'_, State>,
    id: i64,
) -> Result<(), String> {
    state
        .inner()
        .appointment
        .delete_appointment(id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_preference_list(
    state: tauri::State<'_, State>,
) -> Result<Vec<model::PreferenceDto>, String> {
    state
        .inner()
        .preference
        .get_preference_list()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn store_preference(
    state: tauri::State<'_, State>,
    preference: model::EditPreferenceDto,
) -> Result<(), String> {
    state
        .inner()
        .preference
        .store_preference(preference)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn open_app_data_directory(
    app: tauri::AppHandle,
    state: tauri::State<'_, State>,
) -> Result<(), String> {
    app.opener()
        .reveal_item_in_dir(&state.inner().db_path)
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .resolve("", BaseDirectory::AppData)
                .expect("failed to resolve app data dir");

            let state = tauri::async_runtime::block_on(async { State::new(&app_data_dir).await });
            app.manage(state);

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_employee_list,
            get_employee_by_id,
            store_employee,
            delete_employee,
            get_customer_list,
            get_customer_by_id,
            store_customer,
            delete_customer,
            get_customer_appointment_list,
            get_customer_appointment_by_id,
            store_customer_appointment,
            delete_customer_appointment,
            get_preference_list,
            store_preference,
            open_app_data_directory,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
