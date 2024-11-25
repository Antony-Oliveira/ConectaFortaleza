<script setup lang="ts">
import { useRoute } from '#app';
import logo from '../../assets/image.png';

// Props para determinar a rota ativa
const props = defineProps<{
  isActive: (href: string) => boolean;
}>();

// Acessar a rota atual
const route = useRoute();
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-10 bg-gray-800 text-white flex justify-around p-2">
    <Button
      :class="{'text-orange-300': props.isActive('/'), 'text-white': !props.isActive('/')}"
      icon="pi pi-table"
      class="p-button-text"
      to="/"
    />
    <Button
      :class="{'text-orange-300': props.isActive('/pedidos'), 'text-white': !props.isActive('/pedidos')}"
      icon="pi pi-send"
      class="p-button-text"
      to="/pedidos"
    />
    <div class="bg-beige p-0 box-border rounded-full w-12 h-12 flex items-center justify-center">
      <img :src="logo" alt="Logo" class="object-cover w-full h-full" />
    </div>
    <Button
      :class="{'text-orange-300': props.isActive('/revenue'), 'text-white': !props.isActive('/revenue')}"
      icon="pi pi-dollar"
      class="p-button-text"
      to="/revenue"
    />
    <Button
      :class="{'text-orange-300': props.isActive('/product/panel'), 'text-white': !props.isActive('/product/panel')}"
      icon="pi pi-database"
      class="p-button-text"
      to="/product/panel"
    />
  </div>
</template>

<style scoped>
.bg-beige {
  background-color: #F5F5DC;
}
</style>
