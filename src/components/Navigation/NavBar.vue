<template>
    <div class="navbar navbar-expand-lg container-fluid p-2 rounded-0" style="background-color: #fff">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse ms-3" id="navbarSupportedContent">
            <div class="d-flex">
                <img src="http://i.imgur.com/w7rolt3.png" alt="drive" width="35" height="35" class="me-2 mt-1">
                <div style="font-size: 21px; font-weight: bold;" class="mt-2">File Management System</div>
            </div>
        </div>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item position-relative" v-show="$route.name !== 'Login'">
                <div class="dropdown pb-1 mt-1 me-3">
                    <a href="#" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://avatars.githubusercontent.com/u/158018592?v=4" alt="admin" width="30"
                            height="30" class="rounded-circle">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end mt-1 profile" aria-labelledby="dropdownUser1"
                        style="font-size: 1rem;">
                        <li><a class="dropdown-item" href="#">
                                <i class="bi bi-person-square me-3"></i> Profile</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <router-link class="dropdown-item" to="/" @click="logout">
                            <i class="bi bi-box-arrow-right me-3"></i> Sign out
                        </router-link>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
const logout = () => {
    sessionStorage.removeItem("isLoggedIn"); // Remove the authentication state from the session storage
    history.pushState(history.state, '', location.href); // Add a new history entry for the current page
    window.onpopstate = function () {
        history.go(1);
    };
};
</script>
<style scoped>
.profile {
    background-color: #ffffff;
    padding: 0.5rem 0;
    width: 250px;
}

.profile :hover {
    background-color: #c3bebe;
}
</style>
