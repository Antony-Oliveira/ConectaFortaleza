<template>
    <div class="min-h-screen bg-gray-50">
      <section class="bg-blue-600 text-white py-16 text-center">
        <h1 class="text-4xl font-bold">Bem-vindo ao Conecta Fortaleza</h1>
        <p class="mt-4 text-lg">Conectando pessoas a serviços de qualidade na nossa cidade!</p>
        <Button label="Comece Agora" class="p-button-rounded mt-6" href="/register" />
      </section>
  
      <section class="container mx-auto py-10 px-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Serviços Disponíveis</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="servico in servicos" 
            :key="servico.id" 
            class="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h3 class="text-lg font-semibold text-blue-600 mb-2">{{ servico.titulo }}</h3>
            <p class="text-gray-700 flex-1">{{ servico.descricao }}</p>
            <p class="text-gray-600 mt-4 text-sm">Categoria: <span class="font-semibold">{{ servico.categoria.nome }}</span></p>
            <p class="text-gray-600 text-sm">Tipo: <span class="font-semibold">{{ servico.tipo }}</span></p>
            <p class="text-gray-900 font-bold text-lg mt-2">
              {{ servico.preco ? `R$ ${servico.preco.toFixed(2)}` : "Preço sob consulta" }}
            </p>
            <div class="flex items-center mt-4">
              <Avatar :image="mockLogo" class="mr-3" size="large" />
              <p class="text-gray-800">Oferecido por <span class="font-semibold">{{ servico.usuario.nome }}</span></p>
            </div>
            <Button label="Ver Detalhes" class="p-button-sm mt-6 self-end" />
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useFetch } from "#app";
  import mockLogo from '~/assets/usermock.png'
  const servicos = ref([]);
  
  onMounted(async () => {
    const response = await $fetch("/servicos");  
    console.log(response.servicos);
    
    servicos.value = response.servicos;
  });
  </script>
  
  <style>
  /* Adicione estilos personalizados, se necessário */
  </style>
  