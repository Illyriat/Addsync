import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, remove } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { load } from "@tauri-apps/plugin-store";

const STORE_FILE = "store.json";

function FolderSelector({ gameKey }) {
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
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">{gameKey.toUpperCase()} Folder</h2>
      <button onClick={selectFolder} className="bg-blue-500 text-white px-4 py-2 rounded">
        Select Folder
      </button>
      {folderPath && <p className="mt-2">Selected Path: {folderPath}</p>}

      <ul className="mt-2">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <li key={entry.path || `entry-${index}`} className="flex justify-between border-b py-1">
              <span>{entry.name}</span>
              <button
                onClick={() => deleteEntry(entry)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No files or folders found.</p>
        )}
      </ul>
    </div>
  );
}

export default FolderSelector;
