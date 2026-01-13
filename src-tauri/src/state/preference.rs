use sqlx::{Pool, Sqlite};
use std::sync::Arc;

use crate::{
    error::ServiceResult,
    model::{EditPreferenceDto, PreferenceDto},
};

#[derive(Clone)]
pub struct PreferenceState {
    pool: Arc<Pool<Sqlite>>,
}

impl PreferenceState {
    pub fn new(pool: Arc<Pool<Sqlite>>) -> Self {
        Self { pool }
    }

    pub async fn get_preference_list(&self) -> ServiceResult<Vec<PreferenceDto>> {
        let mut connection = self.pool.acquire().await.unwrap();
        Ok(sqlx::query_as::<_, PreferenceRow>(
            r#"
            SELECT p.key, p.value FROM preference p;
        "#,
        )
        .fetch_all(connection.as_mut())
        .await?
        .into_iter()
        .map(|row| row.into())
        .collect())
    }

    pub async fn store_preference(&self, preference: EditPreferenceDto) -> ServiceResult<()> {
        let mut connection = self.pool.acquire().await.unwrap();

        if let Some(value) = preference.value {
            sqlx::query(
                r#"
                INSERT INTO preference (key, value)
                VALUES ($1, $2)
                ON CONFLICT (key) DO UPDATE SET value=$2;
            "#,
            )
            .bind(&preference.key)
            .bind(&value)
            .execute(connection.as_mut())
            .await?;
        } else {
            sqlx::query(
                r#"
                DELETE FROM preference
                WHERE key = $1;
            "#,
            )
            .bind(preference.key)
            .execute(connection.as_mut())
            .await?;
        }

        Ok(())
    }
}

#[derive(sqlx::FromRow)]
struct PreferenceRow {
    pub key: String,
    pub value: String,
}

impl Into<PreferenceDto> for PreferenceRow {
    fn into(self) -> PreferenceDto {
        PreferenceDto {
            key: self.key,
            value: self.value,
        }
    }
}
