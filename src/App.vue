<script setup>
import { useRoute } from 'vue-router';
import Navbar from '../src/components/Navigation/NavBar.vue'
import Sidebar from '../src/components/Navigation/SideBar.vue'

const route = useRoute();
</script>

<template>
  <Navbar v-if="route.name !== 'Login'"></Navbar>
  <div class="container-fluid container-bg">
    <div class="row flex-nowrap">
      <div class="col-auto px-0">
        <Sidebar v-if="route.name !== 'Login'"></Sidebar>
      </div>
      <div class="col px-0">
        <router-view :key="$route.path"></router-view>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');

body {
  min-height: 100vh;
}

#app {
  background-color: #f4f4f5;
  min-height: 100vh;
  font-family: 'Open Sans', sans-serif;
}

.app-content {
  min-height: inherit;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1 1 100%;
  position: relative;
}

/* Container */
.container,
.container-fluid,
.container-lg,
.container-md,
.container-sm,
.container-xl,
.container-xxl {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.04);
  opacity: 1;
  background-color: white;
}

.container-title {
  height: 12%;
  border-bottom: 1px solid #F1F6FA;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}

.container-title__content {
  display: flex;
  align-items: center;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
  height: 100%
}

.container-content {
  height: 88%;
}

.btn {
  border-radius: 5px;
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 8px;
  height: 15px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.container-bg {
  background-color: #eef1f3;
}
</style>