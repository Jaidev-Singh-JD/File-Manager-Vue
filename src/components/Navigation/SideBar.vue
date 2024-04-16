<template>
    <div class="d-flex sidebar">
        <div class="p-3 mt-1" style="background-color: #eef1f3;">
            <div class="dropdown b-5" @click="toggleDropdown" style="text-align: center;">
                <button class="btn createFolder" type="button" id="dropdownMenuButton1" :aria-expanded="showDropdown">
                    <i class="bi bi-plus-lg"></i> New
                </button>
                <ul class="dropdown-menu custom-dropdown" :class="{ show: showDropdown }"
                    aria-labelledby="dropdownMenuButton1" style="font-size: 1rem;">
                    <li @click="openModal"><a class="dropdown-item" href="#"><i class="bi bi-folder-plus"></i> New
                            folder</a></li>
                            <input type="file" ref="fileInput" accept=".pdf" @change="uploadFile" style="display: none" />
                            <li><a class="dropdown-item" href="#" @click="triggerFileUpload"><i class="bi bi-file-earmark-arrow-up"></i> File upload </a>
                    </li>
                </ul>
            </div>
            <div class="mt-4">
                <router-link to="/landing" class="d-block p-2 text-decoration-none link"
                    exact-active-class="active-link">
                    <i class="bi bi-house-door-fill me-2"></i>
                    Home
                </router-link>
                <router-link to="/file" class="d-block p-2 text-decoration-none link" exact-active-class="active-link">
                    <i class="bi bi-file-earmark-text-fill me-2"></i>
                    All Files
                </router-link>
                <router-link to="/recent" class="d-block p-2 text-decoration-none link"
                    exact-active-class="active-link">
                    <i class="bi bi-clock-fill me-2"></i>
                    Recent Upload
                </router-link>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" style="background-color: rgba(255, 255, 255, 0.5);"
        v-bind:class="{ 'show d-block': showModal }" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="exampleModalLongTitle">New Folder</h5>
                </div>
                <div class="m-2 ms-2 p-2">
                    <input type="text" class="form-control" v-model="newFolderName"
                        :class="{ 'is-invalid': errorMessage }" placeholder="Enter folder name" />
                    <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" @click="hideModal">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="addFolder">Create</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineExpose } from 'vue';
import { useStore } from 'vuex';
import { findFolder } from '@/Utilis/helper';

const folders = computed(() => store.state.folders);

const store = useStore();

let newFolderName = ref('');
let errorMessage = ref('');
const showModal = ref(false);
const showDropdown = ref(false);
const fileInput = ref(null);

const CONTENT_TYPE = {
    FOLDER: 'Folder',
    FILE: 'File'
}

const triggerFileUpload = () => {
  fileInput.value.click();
  showDropdown.value = false;
};

const uploadFile = (event) => {
  const file = event.target.files[0];
  const newFile = {
    id: store.state.nextFolderId,
    name: file.name,
    type: CONTENT_TYPE.FILE,
    dateCreated: new Date(),
    size: file.size, // Add this line to store the file size
    file: file,
  };

  // Check if a folder is selected
  if (store.state.selectedFolder) {
    // Find the folder where the file should be added
    const targetFolder = findFolder(folders.value, store.state.selectedFolder.id);

    if (targetFolder && Array.isArray(targetFolder.content)) {
      targetFolder.content.push(newFile);
    }
  } else {
    // If no folder is selected, add the file to the root
    store.state.folders.push(newFile);
  }

  store.commit("incrementFolderId");
};

const addFolder = () => {
    if (!newFolderName.value.trim()) {
        errorMessage.value = "Folder name can't be empty";
        return;
    }
    // regular expression
    const newFolderNameNoSpaces = newFolderName.value.replace(/\s/g, '');

    const existingFolder = store.state.folders.find(folder => folder.name.replace(/\s/g, '') === newFolderNameNoSpaces);
    if (existingFolder) {
        errorMessage.value = "A folder with this name already exists";
        return;
    }
    const newFolder = { id: store.state.nextFolderId, name: newFolderName.value, type: CONTENT_TYPE.FOLDER, dateCreated: new Date(), content: [] };

    if (store.state.selectedFolder && Array.isArray(store.state.selectedFolder.content)) {
        store.state.selectedFolder.content.push(newFolder);
        store.commit('incrementFolderId');
    } else {
        store.commit('addFolder', newFolder);
        store.commit('incrementFolderId');
    }

    newFolderName.value = '';
    showModal.value = false;
};

const toggleDropdown = (event) => {
    if (event.target.id === 'dropdownMenuButton1') {
        showDropdown.value = !showDropdown.value;
        errorMessage.value = '';
    }
};

const closeDropdown = (event) => {
    if (event.target.closest('.dropdown') === null) {
        showDropdown.value = false;
    }
};

const openModal = () => {
    showModal.value = true;
    showDropdown.value = false;
};
const hideModal = () => {
    showModal.value = false;
    newFolderName.value = '';
};

defineExpose({
  showModal, 
  openModal,
  newFolderName, 
  addFolder, 
  errorMessage,
  showDropdown, 
  toggleDropdown, 
  closeDropdown, 
  triggerFileUpload, 
  uploadFile, 
  hideModal
});
onMounted(() => {
    window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    window.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.sidebar {
    height: calc(100vh - 56px);
}

.link {
    color: rgb(0, 0, 0);

}

.link:not(.active-link):hover {
    color: #000000;
    border-radius: 20px;
    background-color: #ffffff;
}

.custom-dropdown {
    background-color: #ffffff;
    padding: 0.5rem 0;
    width: 250px;
}

.custom-dropdown :hover {
    background-color: #c3bebe;
}

.dropdown-item i {
    margin-right: 40px;
}

.createFolder {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    width: 120px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.createFolder:hover {
    background-color: #c3bebe;
    color: #000000;
    transform: scale(1.1);
}

.active-link {
    color: rgb(0, 0, 0);
    background-color: #95d8e2;
    border-radius: 20px;
}
</style>