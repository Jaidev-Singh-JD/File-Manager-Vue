<template>
  <div class="container-bg">
    <div class="d-flex justify-content-between">
      <div class="m-3">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item">
              <i class="bi bi-house-door-fill me-2 text-primary"></i>
              <a href="#" @click.prevent="goToLandingPage">Home</a>
            </li>
            <li class="breadcrumb-item" v-for="(crumb, index) in breadcrumb.slice(1)" :key="index">
              <a href="#" @click.prevent="selectFolderById(crumb.id)">{{
                crumb.name
              }}</a>
            </li>
          </ol>
        </nav>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 m-2">
        <div class="d-flex">
          <div class="input-group searchBar">
            <input type="text" class="form-control" placeholder="Search..." />
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
          </div>
          <div class="toggleView">
            <i class="bi bi-grid-fill resize-icon" :class="{ active: view === 'grid' }" @click="view = 'grid'"></i>
            <div class="vr"></div>
            <i class="bi bi-list resize-icon" :class="{ active: view === 'list' }" @click="view = 'list'"></i>
          </div>
        </div>
      </div>
    </div>
    <hr class="mt-1" />
    <!-- {{ selectedFolder?.content }} -->
    <div class="p-3 rounded-0">
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
            <div class="col-2 gridCard" v-for="content in sortedFolders" :key="content.id" style="position: relative">
              <div class="folder-icon pt-1 text-center" v-if="content.type == CONTENT_TYPE.FILE">
                <img class="img-fluid" src="../assets/icon/Doc-PDF.svg" alt="folder" />
                <p class="mt-1 folder-name">{{ content.name }}</p>
              </div>
              <div class="folder-icon pt-1 text-center" v-else @dblclick="selectFolder(content)">
                <img class="img-fluid" src="../assets/icon/folder-fill.svg" alt="folder" />
                <p class="mt-1 folder-name">{{ content.name }}</p>
              </div>
              <div @click="openDeleteModal(content)" style="position: absolute; top: 0; right: 0; visibility: hidden"
                class="delete-icon">
                <i class="bi bi-trash3-fill"></i>
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
                  <th scope="col" style="text-align: center">Type</th>
                  <th scope="col" style="text-align: center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="content in sortedFolders" :key="content.id">
                  <td>
                    <div v-if="content.type === CONTENT_TYPE.FOLDER" @dblclick="selectFolder(content)"
                      class="folder-content">
                      <img class="img-fluid" :src="require('../assets/icon/folder-fill.svg')" alt="folder" width="30px"
                        height="30px" style="margin-right: 10px" />
                      <span>{{ content.name }}</span>
                    </div>
                    <div v-else class="folder-content">
                      <img class="img-fluid" :src="require('../assets/icon/Doc-PDF.svg')" alt="file" width="30px"
                        height="30px" style="margin-right: 10px" />
                      <span>{{ content.name }}</span>
                    </div>
                  </td>
                  <td class="text-muted text-center">
                    {{
                new Date(content.dateCreated).toLocaleDateString() +
                " " +
                new Date(content.dateCreated).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
                  </td>
                  <td class="text-muted text-center">
                    {{ calculateSize(content) }}
                  </td>
                  <td class="text-muted text-center">{{ content.type }}</td>
                  <td style="text-align: right;">
                    <i @click="openDeleteModal(content)" class="bi bi-trash3-fill me-3"></i>
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
          <!-- <button class="btn btn-primary btn-lg position-fixed bottom-0 end-0 m-3 rounded-circle add-folder"
              @click="addFolder">
              <i class="bi bi-folder-plus"></i>
            </button> -->
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
          <h5 class="modal-title" id="deleteModalLongTitle">Delete Folder</h5>
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
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { findFolder } from "../Utilis/helper.js";
import { findFolderPath } from "../Utilis/helperpath.js";

const store = useStore();
const router = useRouter();
const view = ref("grid"); // Default viewy

let showDeleteModal = ref(false);
let folderToDelete = ref(null);


const CONTENT_TYPE = {
  FOLDER: "Folder",
  FILE: "File",
};
const folders = computed(() => store.state.folders);
const selectedFolder = computed(() => store.state.selectedFolder);

const sortedFolders = computed(() => {
  return [
    ...(selectedFolder.value ? selectedFolder.value.content : folders.value),
  ].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
});

const calculateSize = (content) => {
  const sizeInMB = (
    content.type === CONTENT_TYPE.FILE
      ? content.size / 1024 / 1024
      : store.getters.getFolderSize(content) / 1024 / 1024
  ).toFixed(2);
  return isNaN(sizeInMB) ? "NA" : sizeInMB + " MB";
};

const breadcrumb = computed(() => {
  if (store.state.selectedFolder) {
    const path = findFolderPath(folders.value, store.state.selectedFolder.id);
    if (path.length > 0) {
      path.unshift({ name: "Home", id: null });
    }
    return path;
  }
  return [];
});
const selectFolderById = (id) => {
  if (id === "Home") {
    console.log("Navigating to landing page");
    router.push({ name: "landingPage" });
  } else {
    const folder = findFolder(folders.value, id);
    if (folder) {
      selectFolder(folder);
    }
  }
};

const selectFolder = (folder) => {
  console.log("Clicked folder:", folder);
  const foundFolder = findFolder(folders.value, folder.id);
  console.log("Found folder:", foundFolder);
  store.commit("selectFolder", foundFolder);
  console.log("Updated selectedFolder:", store.state.selectedFolder);
  router.push(`/folder/${folder.id}`);
};

const goToLandingPage = () => {
  store.commit("deselectFolder");
  router.push({ name: "landingPage" });
};
const deletefolder = (content) => {
  console.log("delete folder", content);
  store.dispatch("deleteContentById", content.id);
  hideDeleteModal();
};

const openDeleteModal = (content) => {
  folderToDelete.value = content;
  showDeleteModal.value = true;
};

const hideDeleteModal = () => {
  showDeleteModal.value = false;
};

onMounted(() => {
  console.log("onmounted", folders.value, folders.value[0]);
  if (!store.state.selectedFolder) {
    store.commit("selectFolder", folders.value[0]);
  }
});

watch(
  () => store.selectedFolder,
  (c, p) => {
    if (c?.id !== p?.id) {
      router.replace(`/folder/${c.id}`);
    }
  }
);
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
  margin: 20px;
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
  border-right: 1px solid black;
  padding-right: 10px;
  padding-left: 10px;
}

.searchBar {
  border-radius: px;
}

.folder-content {
  cursor: pointer;
}

.active {
  filter: invert(0.5) sepia(1) hue-rotate(175deg) saturate(5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
