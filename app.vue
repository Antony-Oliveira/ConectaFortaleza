<template>
    <div>
      <Navbar v-if="!excludeNavbarRoutes.includes(route.path)">
        <NuxtPage />
      </Navbar>
      <NuxtPage v-else />
    </div>
  </template>
  
  <script setup>
  import Navbar from './components/Navbar/Navbar.vue';
  import { useRoute } from '#app';
  import 'primeicons/primeicons.css';
  
  const route = useRoute();
  
  const excludeNavbarRoutes = ['/login', '/registro'];
  </script>
  
  <style>
  .page-enter-active,
  .page-leave-active {
      transition: all 0.2s;
  }
  
  .page-enter-from,
  .page-leave-to {
      opacity: 0;
      filter: blur(1rem);
  }
  </style>
  