export function findFolder(folders, id) {
    for (const folder of folders) {
        if (folder.id === id) {
          return folder;
        } else if (folder.content) {
          const foundFolder = findFolder(folder.content, id);
          if (foundFolder) {
            return foundFolder;
          }
        }
      }
      return null;
  }