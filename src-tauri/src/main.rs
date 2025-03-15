#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Builder;
use tauri_plugin_dialog::init as dialog_init;
use tauri_plugin_fs::init as fs_init;

fn main() {
    Builder::default()
        .plugin(fs_init()) // Initialize FS Plugin with default permissions
        .plugin(dialog_init()) // Ensure Dialog Plugin is initialized
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
