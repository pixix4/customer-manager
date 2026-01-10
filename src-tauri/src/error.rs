use derive_more::Display;

/// Represent errors in the application
#[derive(Debug, Display, Clone)]
pub enum ServiceError {
    #[display("Internal Server Error: '{}'\n{}", _0, _1)]
    InternalServerError(&'static str, String),
}

/// Helper for `ServiceError` result
pub type ServiceResult<T> = Result<T, ServiceError>;

impl From<std::io::Error> for ServiceError {
    fn from(error: std::io::Error) -> Self {
        ServiceError::InternalServerError("IO error", format!("{}", error))
    }
}

impl From<tokio::task::JoinError> for ServiceError {
    fn from(error: tokio::task::JoinError) -> Self {
        ServiceError::InternalServerError("Threading error", format!("{}", error))
    }
}

impl From<std::string::FromUtf8Error> for ServiceError {
    fn from(error: std::string::FromUtf8Error) -> Self {
        ServiceError::InternalServerError("Utf8Encoding error", format!("{}", error))
    }
}

impl From<std::num::ParseIntError> for ServiceError {
    fn from(error: std::num::ParseIntError) -> Self {
        ServiceError::InternalServerError("Illegal number string", format!("{}", error))
    }
}

impl From<std::str::Utf8Error> for ServiceError {
    fn from(error: std::str::Utf8Error) -> Self {
        ServiceError::InternalServerError("Utf8 conversion error", format!("{}", error))
    }
}

impl From<sqlx::Error> for ServiceError {
    fn from(error: sqlx::Error) -> Self {
        ServiceError::InternalServerError("Sqlx error", format!("{}", error))
    }
}

impl<T> From<std::sync::PoisonError<std::sync::RwLockWriteGuard<'_, T>>> for ServiceError {
    fn from(error: std::sync::PoisonError<std::sync::RwLockWriteGuard<'_, T>>) -> Self {
        ServiceError::InternalServerError("Lock poison error", format!("{:?}", error))
    }
}

impl<T> From<std::sync::PoisonError<std::sync::RwLockReadGuard<'_, T>>> for ServiceError {
    fn from(error: std::sync::PoisonError<std::sync::RwLockReadGuard<'_, T>>) -> Self {
        ServiceError::InternalServerError("Lock poison error", format!("{:?}", error))
    }
}

impl std::error::Error for ServiceError {}
