import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, remove, BaseDirectory } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path"; // Correct import for the join function

function FolderSelector() {
  const [folderPath, setFolderPath] = useState("");
  const [entries, setEntries] = useState([]);

  const loadEntries = async (selectedPath) => {
    try {
      const items = await readDir(selectedPath, { recursive: false });
      setEntries(items);
    } catch (error) {
      console.error("🔥 Error reading folder contents:", error);
    }
  };

  const selectFolder = async () => {
    try {
      const selected = await open({ directory: true, multiple: false });
      if (selected) {
        setFolderPath(selected);
        loadEntries(selected);
      }
    } catch (error) {
      console.error("🔥 Error selecting folder:", error);
    }
  };

  const deleteEntry = async (entry) => {
    try {
      const fullPath = await join(folderPath, entry.name); // Use join from plugin-fs
      console.log(`🔥 Deleting: ${fullPath}`);
  
      await remove(fullPath, { recursive: true }); // Recursively delete folder
  
      loadEntries(folderPath);
    } catch (error) {
      console.error(`🔥 Error deleting ${entry.name}:`, error);
    }
  };
  

  return (
    <div className="p-4 border rounded-lg">
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
