import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, remove } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store";
import "./FolderSelector.css";

const STORE_FILE = "store.json";

function FolderSelector({ gameKey, darkMode, setHasFolder }) {
  const [folderPath, setFolderPath] = useState("");
  const [entries, setEntries] = useState([]);
  const [store, setStore] = useState(null);
  const STORE_KEY = `selectedFolderPath_${gameKey}`;

  useEffect(() => {
    const initStore = async () => {
      console.log(`🔍 Checking store for ${gameKey}...`);

      if (!window.__TAURI__) {
        console.warn(`🔥 Store plugin is not available (not running in Tauri) for ${gameKey}.`);
        return;
      }

      try {
        console.log(`🔄 Loading store for ${gameKey}...`);
        const storeInstance = await load(STORE_FILE, { autoSave: true });
        setStore(storeInstance);
        console.log(`✅ Store Plugin Loaded for ${gameKey}`);

        const savedPath = await storeInstance.get(STORE_KEY);
        if (savedPath) {
          console.log(`✅ Found stored path for ${gameKey}:`, savedPath);
          setFolderPath(savedPath);
          setHasFolder(true); // ✅ Update game page state
          loadEntries(savedPath);
        } else {
          console.log(`ℹ️ No stored path found for ${gameKey}.`);
        }
      } catch (error) {
        console.error(`🔥 Error loading store for ${gameKey}:`, error);
      }
    };

    initStore();
  }, [gameKey]);

  const loadEntries = async (selectedPath) => {
    try {
      const items = await readDir(selectedPath, { recursive: false });
      setEntries(items);
      setHasFolder(items.length > 0); // ✅ Update game page state
    } catch (error) {
      console.error(`🔥 Error reading folder contents for ${gameKey}:`, error);
    }
  };

  const selectFolder = async () => {
    try {
      const selected = await open({ directory: true, multiple: false });
      if (selected) {
        console.log(`📁 Selected Folder for ${gameKey}:`, selected);
        setFolderPath(selected);
        setHasFolder(true); // ✅ Update game page state
        loadEntries(selected);

        if (store) {
          console.log(`💾 Storing path for ${gameKey}:`, selected);
          await store.set(STORE_KEY, selected);
          await store.save();
        } else {
          console.warn(`⚠️ Store is not initialized yet for ${gameKey}!`);
        }
      }
    } catch (error) {
      console.error(`🔥 Error selecting folder for ${gameKey}:`, error);
    }
  };

  const deleteEntry = async (entry) => {
    try {
      const fullPath = await join(folderPath, entry.name);
      console.log(`🔥 Deleting: ${fullPath} for ${gameKey}`);

      await remove(fullPath, { recursive: true });

      // Reload entries after deletion
      loadEntries(folderPath);
    } catch (error) {
      console.error(`🔥 Error deleting ${entry.name} for ${gameKey}:`, error);
    }
  };

  return (
    <div className={`folder-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h2 className="folder-title">{gameKey.toUpperCase()} Folder</h2>
      
      <button 
        onClick={selectFolder} 
        className="folder-button"
      >
        Select Folder
      </button>

      {folderPath && <p className="folder-path">Selected Path: {folderPath}</p>}

      <ul className="folder-list">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <li 
              key={entry.path || `entry-${index}`} 
              className="folder-item"
            >
              <span>{entry.name}</span>
              <button
                onClick={() => deleteEntry(entry)}
                className="folder-delete"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="folder-empty">No files or folders found.</p>
        )}
      </ul>
    </div>
  );
}

export default FolderSelector;
