import { createStore } from "vuex";

const CONTENT_TYPE = {
  FOLDER: "Folder",
  FILE: "File",
};

export default createStore({
  state: {
    nextFolderId: 10,
    folders: [
      {
        id: 1,
        name: "Folder 1",
        type: CONTENT_TYPE.FOLDER,
        dateCreated: new Date(),
        content: [
          {
            id: 2,
            name: "File 1",
            type: CONTENT_TYPE.FILE,
            dateCreated: new Date(),
            content: "Hello, World!",
          },
          {
            id: 3,
            name: "Folder 1.1",
            type: CONTENT_TYPE.FOLDER,
            dateCreated: new Date(),
            content: [
              {
                id: 5,
                name: "File 1.1",
                type: CONTENT_TYPE.FILE,
                dateCreated: new Date(),
                content: "Hello, World!",
              },
              {
                id: 6,
                name: "Folder 1.1.1",
                type: CONTENT_TYPE.FOLDER,
                dateCreated: new Date(),
                content: [
                  {
                    id: 7,
                    name: "File 1.1.1",
                    type: CONTENT_TYPE.FILE,
                    dateCreated: new Date(),
                    content: "Hello, World!",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 8,
        name: "Folder 2nd",
        type: CONTENT_TYPE.FOLDER,
        dateCreated: new Date(),
        content: [
          {
            id: 9,
            name: "File 2",
            type: CONTENT_TYPE.FILE,
            dateCreated: new Date(),
            content: "Hello, World!",
          },
        ],
      },
    ],
    selectedFolder: null,
  },
  mutations: {
    addFolder(state, folder) {
      state.folders.push(folder);
    },
    selectFolder(state, folder) {
      state.selectedFolder = folder;
    },
    incrementFolderId(state) {
      state.nextFolderId++;
    },
    addSubFolder(state, newFolder) {
      if (state.selectedFolder && Array.isArray(state.selectedFolder.content)) {
        state.selectedFolder.content.push(newFolder);
      }
    },
    deselectFolder(state) {
      state.selectedFolder = null;
    },
    deleteContentById(state, id) {
      const findAndDelete = (content, id) => {
        for (let i = 0; i < content.length; i++) {
          if (content[i].id === id) {
            content.splice(i, 1);
            return true;
          } else if (content[i].type === "Folder") {
            const found = findAndDelete(content[i].content, id);
            if (found) {
              return true;
            }
          }
        }
        return false;
      };

      findAndDelete(state.folders, id);
    },
  },
  actions: {
    addFolder({ commit, state }, folderName) {
      const newFolder = {
        id: state.nextFolderId,
        name: folderName,
        type: CONTENT_TYPE.FOLDER,
        content: [],
      };
      commit("addFolder", newFolder);
      commit("incrementFolderId");
    },
    deleteContentById({ commit }, id) {
      commit("deleteContentById", id);
    },
  },
  getters: {
    getFolderSize: () => (folder) => {
      console.log('in getter', folder.length)
      // let totalSize = 0;
  
      // const calculateSize = (content) => {
      //   for (let i = 0; i < content.length; i++) {
      //     if (content[i].type === CONTENT_TYPE.FILE) {
      //       totalSize += content[i].size;
      //     } else if (content[i].type === CONTENT_TYPE.FOLDER) {
      //       calculateSize(content[i].content);
      //     }
      //   }
      // };
  
      // calculateSize(folder.content);
  
      return folder.content.length +  ' items ';
    },
  },
});
