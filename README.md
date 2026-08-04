# File Manager Vue

A Vue 3 file manager demo application designed to showcase routing, state management, and file navigation functionality in a clean, educational project.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Notes](#notes)

## Overview

This repository contains a small Vue.js application that demonstrates a file manager interface with support for navigation, folder views, recent items, and a simple login/landing workflow.

## Features

- Vue 3 application setup with the Vue CLI
- Client-side routing using `vue-router`
- Centralized state management with `vuex`
- Responsive UI built with Bootstrap 5 and Bootstrap Icons
- Separate views for file listing, folder display, recent items, login, and landing page
- Linting configuration via ESLint

## Technology Stack

- Vue 3
- Vue Router 4
- Vuex 4
- Bootstrap 5
- Bootstrap Icons
- ESLint

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Available Scripts

- `npm run serve` - start the development server
- `npm run build` - build the production bundle
- `npm run lint` - run lint checks

## Project Structure

- `src/App.vue` - application shell and layout
- `src/main.js` - application entry point
- `src/router/index.js` - route definitions
- `src/store/index.js` - Vuex store configuration
- `src/views/` - page view components
- `src/components/` - reusable UI components
- `src/Utilis/` - helper utilities

## Notes

- This project is intended for learning and experimentation.
- It is not configured for production deployment without further enhancements.
- For additional configuration options, see the [Vue CLI configuration reference](https://cli.vuejs.org/config/).
