import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir, BaseDirectory } from "@tauri-apps/plugin-fs"; // ✅ Fixed import

function FolderSelector() {
  const [folderPath, setFolderPath] = useState("");
  const [files, setFiles] = useState([]);

  const selectFolder = async () => {
    try {
      const selected = await open({ directory: true, multiple: false });

      if (selected) {
        setFolderPath(selected);
        const entries = await readDir(selected, { recursive: false });
        setFiles(entries);
      }
    } catch (error) {
      console.error("🔥 Error selecting folder:", error);
    }
  };

  const deleteFile = async (filePath) => {
    try {
      await removeFile(filePath);
      setFiles(files.filter((file) => file.path !== filePath));
    } catch (error) {
      console.error("🔥 Error deleting file:", error);
    }
  };

  return (
    <div>
      <button onClick={selectFolder}>Select Folder</button>
      {folderPath && (
        <div>
          <p>Selected Folder: {folderPath}</p>
          <ul>
            {files.map((file) => (
              <li key={file.path}>
                {file.name}
                {file.children === undefined && (
                  <button onClick={() => deleteFile(file.path)}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FolderSelector;
