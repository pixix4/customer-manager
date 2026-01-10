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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let state = State::new().await;

    tauri::Builder::default()
        .manage(state)
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
