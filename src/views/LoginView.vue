<template>
  <div class="vh-100 p-5 d-flex justify-content-center align-items-center overflow-hidden">
    <div class="d-flex align-items-center justify-content-center w-100">
      <div class="mr-3">
        <img src="../assets/icon/login.gif" alt="Icon" class="mb-3 img-fluid login-icon" />
      </div>
      <div class="card w-100 w-md-50 shadow-card">
        <div class="card-body">
          <div class="text-center mb-4">
            <img src="../assets/login_icon.svg" alt="Icon" class="mb-3 img-fluid" />
            <h3>Sign in to File Manager</h3>
          </div>
          <form @submit.prevent="login">
            <div class="form-group mb-3">
              <label class="mb-1" for="username">Username:</label>
              <input id="username" v-model="username" type="text" class="form-control"
                :class="{ 'is-invalid': usernameError }" autocomplete="off" placeholder="Enter your username" />
              <div class="invalid-feedback" v-if="usernameError">{{ usernameError }}</div>
            </div>
            <div class="form-group mb-3 mt-3">
              <label class="mb-1" for="password">Password:</label>
              <input id="password" v-model="password" type="password" class="form-control"
                :class="{ 'is-invalid': passwordError }" autocomplete="off" placeholder="Enter password" />
              <div class="invalid-feedback" v-if="passwordError">{{ passwordError }}</div>
            </div>
            <button @submit="login" type="submit" class="btn btn-success btn-block mt-4 w-100">
              <i class="bi bi-box-arrow-in-right"></i> Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const usernameError = ref('');
const passwordError = ref('');

const login = () => {
  const hardcodedUsername = 'admin';
  const hardcodedPassword = 'jaidev';

  usernameError.value = '';
  passwordError.value = '';

  if (!username.value) {
    usernameError.value = 'Username is required';
  } else if (username.value !== hardcodedUsername) {
    usernameError.value = 'Invalid username please try again';
  }

  if (!password.value) {
    passwordError.value = 'Password is required';
  } else if (password.value !== hardcodedPassword) {
    passwordError.value = 'Invalid password please try again';
  }

  if (usernameError.value === '' && passwordError.value === '') {
    console.log('Logged in');
    sessionStorage.setItem('isLoggedIn', 'true');
    router.push({ name: 'landingPage' });
    history.pushState(history.state, '', location.href); // Add a new history entry for the current page
    window.onpopstate = function () {
      history.go(1); // Go forward one page when the back button is pressed
    };
  }
};
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: auto;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.login-icon {
  min-width: 500px;
  min-height: 500px;
  padding: 100px;
}

.shadow-card {
  background-color: transparent;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

input::placeholder {
  font-size: 0.8em;
}
</style>