#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;
use tauri::Manager;
use tauri_plugin_dialog::init as dialog_init;
use tauri_plugin_fs::init as fs_init;
use tauri_plugin_store::{Builder as StoreBuilder, StoreExt};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(fs_init())
        .plugin(dialog_init()) 
        .plugin(StoreBuilder::default().build())
        .setup(|app| {
            let store_handle = app.app_handle();
            println!("✅ Store plugin is initialized!");
            let store = store_handle.store("store.json")?;
            store.set("some-key", json!({ "value": 5 }));
            if let Some(value) = store.get("some-key") {
                println!("Store value: {}", value);
            } else {
                println!("No value found for 'some-key'");
            }
            store.save()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
