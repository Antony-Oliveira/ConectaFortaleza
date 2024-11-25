<template>
    <div class="flex h-screen bg-gray-900">
      <aside
        class="w-24 bg-gray-800 h-full flex flex-col items-center py-6 shadow-md transition-transform duration-300 relative">
        <div class="mb-8 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md overflow-hidden">
          <img :src="logoImage" alt="Logo" class="w-full h-full object-cover" />
        </div>
  
        <!-- Links -->
        <div class="flex flex-col space-y-6 flex-grow">
          <NuxtLink
            v-for="link in links"
            :to="link.href"
            class="sidebar-link"
            :class="{ active: isActive(link.href) }">
            <i :class="link.icon" class="text-2xl"></i>
          </NuxtLink>
        </div>
  
        <!-- Avatar e Menu -->
        <div class="mt-auto">
          <Menu :model="avatarMenuItems" :popup="true" ref="avatarMenu" />
          <Avatar
            image="https://cdn-icons-png.flaticon.com/512/147/147142.png"
            size="large"
            shape="circle"
            class="shadow-md cursor-pointer"
            @click="toggleMenu" />
        </div>
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import logo from '../../public/logo.png';
  import { useRoute, useRouter } from '#app';
  
  const isLoading = ref(false);
  const avatarMenu = ref(null);
  
  const avatarMenuItems = [
    { label: 'Perfil', icon: 'pi pi-user', command: () => navigateTo("/me") },
    { label: 'Notificações', icon: 'pi pi-bell' },
    { label: 'Configurações', icon: 'pi pi-cog', command: () => console.log('Configurações') },
    { label: 'Sair', icon: 'pi pi-sign-out', command: () => console.log('Sair') },
  ];
  
  const links = [
    { href: '/', icon: 'pi pi-home' },
    { href: '/pedidos', icon: 'pi pi-bookmark' },
    { href: '/revenue', icon: 'pi pi-chart-line' },
    { href: '/product/panel', icon: 'pi pi-box' },
  ];
  
  const route = useRoute();
  const router = useRouter();
  const logoImage = logo;
  
  const toggleMenu = (event) => {
    avatarMenu.value.toggle(event);
  };
  
  const isActive = (href) => route.path === href;
  
  onMounted(() => {
  
  });
  
  onUnmounted(() => {

  });
  </script>
  
  <style scoped>
  .sidebar-link {
    @apply text-gray-300 hover:text-gray-100 transition-colors duration-300 p-2 rounded-lg;
  }
  
  .sidebar-link.active {
    @apply text-blue-400 font-bold bg-gray-700;
  }
  
  .mt-auto {
    margin-top: auto;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
  
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  