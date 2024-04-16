<template>
  <div class="container-bg">
    <div class="d-flex justify-content-between">
      <div class="m-3">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0">
            <i class="bi bi-house-door-fill me-2 text-primary"></i>
            <li class="breadcrumb-item"><a href="#">Home</a></li>
          </ol>
        </nav>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 m-2">
        <div class="d-flex">
          <div class="input-group searchBar">
            <input type="text" class="form-control" placeholder="Search...">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
          </div>
          <div class="toggleView">
            <i class="bi bi-grid-fill resize-icon " :class="{ active: view === 'grid' }" @click="view = 'grid'"></i>
            <div class="vr"></div>
            <i class="bi bi-list resize-icon" :class="{ active: view === 'list' }" @click="view = 'list'"></i>
          </div>
        </div>
      </div>
    </div>
    <hr class="mt-1">
    <div class="m-5">
      <div class="row">
        <transition name="fade">
          <div>
            <div v-if="sortedFolders.length === 0" class="text-center mt-5">
              <h1 class="text-muted">This folder is empty</h1>
              <div>
                <img src="../assets/icon/no.jpg" alt="not found" width="300px" height="300px"
                  class="rounded-circle shadow-lg">
              </div>
            </div>
            <div v-if="view === 'grid'" class="row">
              <div class="col-2  gridCard" style="position: relative;" v-for="folder in sortedFolders" :key="folder.id">
                <div class="folder-icon pt-1 w-40 text-center">
                  <div v-if="folder.type === CONTENT_TYPE.FOLDER" @dblclick="selectFolder(folder)">
                    <img class="img-fluid" :src="require('../assets/icon/folder-fill.svg')" alt="folder">
                    <p class="folder-name">{{ folder.name }}</p>
                  </div>
                  <div v-else>
                    <img class="img-fluid" :src="require('../assets/icon/Doc-PDF.svg')" alt="file">
                    <p class="folder-name">{{ folder.name }}</p>
                  </div>
                  <div @click="openDeleteModal(folder)"
                    style="position: absolute; top: 0; right: 0; visibility: hidden;" class="delete-icon">
                    <i class="bi bi-trash3-fill"></i>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="view === 'list' && sortedFolders.length !== 0" class="list-view">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col" style="text-align: center">Date modified</th>
                    <th scope="col" style="text-align: center">Size</th>
                    <th style="text-align: center;" scope="col">Type</th>
                    <th scope="col" style="text-align: center"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="folder in sortedFolders" :key="folder.id">
                    <td>
                      <div v-if="folder.type === CONTENT_TYPE.FOLDER" @dblclick="selectFolder(folder)">
                        <img class="img-fluid" :src="require('../assets/icon/folder-fill.svg')" alt="folder"
                          width="30px" height="30px" style="margin-right: 10px;">
                        <span>{{ folder.name }}</span>
                      </div>
                      <div v-else>
                        <img class="img-fluid" :src="require('../assets/icon/Doc-PDF.svg')" alt="file" width="30px"
                          height="30px" style="margin-right: 10px;">
                        <span>{{ folder.name }}</span>
                      </div>
                    </td>
                    <td class="text-muted text-center">
                      {{
              new Date(folder.dateCreated).toLocaleDateString() +
              " " +
              new Date(folder.dateCreated).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
                    </td>
                    <td class="text-muted text-center">
                      {{ calculateSize(folder) }}
                    </td>
                    <td class="text-muted text-center">{{ folder.type }}</td>
                    <td style="text-align: right;">
                      <i @click="openDeleteModal(folder)" class="bi bi-trash3-fill me-3"></i>
                      <i class="bi bi-pencil-fill"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
        <div class="row">
          <div class="col">
            <!-- <button class="btn btn-danger btn-lg position-fixed bottom-0 end-0 m-3 rounded-circle add-folder"
              @click="addFolder">
              <i class="bi bi-folder-plus"></i>
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" style="background-color: rgba(255, 255, 255, 0.5);"
    v-bind:class="{ 'show d-block': showDeleteModal }" tabindex="-1" role="dialog"
    aria-labelledby="deleteModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="deleteModalLongTitle"> <i class="bi bi-exclamation-triangle-fill me-2"></i> Delete Folder</h5>
        </div>
        <div class="modal-body">
          Do you want to delete this folder?
        </div>
        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary" @click="hideDeleteModal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deletefolder(folderToDelete)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const folders = computed(() => store.state.folders);
const view = ref('grid'); // Default view

let showDeleteModal = ref(false);
let folderToDelete = ref(null);

const CONTENT_TYPE = {
  FOLDER: 'Folder',
  FILE: 'File'
}

const sortedFolders = computed(() => {
  return [...folders.value].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
});

const calculateSize = (content) => {
  const size= (content.type === CONTENT_TYPE.FILE ? content.size / 1024 / 1024 +' MB' : store.getters.getFolderSize(content));
  return size;
};

const selectFolder = (folder) => {
  console.log('selected folder', folder)
  store.commit('selectFolder', folder);
  router.push(`/folder/${folder.id}`);

};
const deletefolder = (folder) => {
  console.log('delete folder', folder)
  store.dispatch('deleteContentById', folder.id);
  hideDeleteModal();
};
const openDeleteModal = (folder) => {
  folderToDelete.value = folder;
  showDeleteModal.value = true;
};

const hideDeleteModal = () => {
  showDeleteModal.value = false;
};

</script>

<style scoped>
.folder-icon {
  cursor: pointer;
}

.add-folder {
  transition: transform 0.3s ease-in-out;
}

.add-folder:hover {
  transform: scale(1.1);
}

.container-bg {
  margin: 22px;
  border-radius: 10px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #ffffff;
}

.toggleView {
  gap: 5px;
  margin: 5px;
  display: flex;
  cursor: pointer;
}

.resize-icon {
  font-size: 22px;
}

.gridIcon {
  border-right: 66px solid black;
  padding-right: 10px;
  padding-left: 10px;
}

.searchBar {
  border-radius: px;
}

.active {
  filter: invert(.5) sepia(1) hue-rotate(175deg) saturate(5);
}

.gridCard {
  margin: 10px;
  width: 120px;
}

.gridCard:hover {
  background-color: #eef1f3;
}

.gridCard:hover .delete-icon {
  visibility: visible !important;
  transform: scale(1.1);
  margin: 5px;
}

.folder-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
