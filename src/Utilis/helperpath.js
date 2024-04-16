export function findFolderPath(folders, id) {
    for (const folder of folders) {
      if (folder.id === id) {
        return [{ name: folder.name, id: folder.id }];
      }
      if (Array.isArray(folder.content)) {
        const path = findFolderPath(folder.content, id);
        if (path.length) {
          return [{ name: folder.name, id: folder.id }, ...path];
        }
      }
    }
    return [];
  }