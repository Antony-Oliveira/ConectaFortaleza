<template>
  <div class="min-h-screen bg-gray-50">
    <section class="bg-blue-600 text-white py-16 text-center">
      <h1 class="text-4xl font-bold">Bem-vindo ao Conecta Fortaleza</h1>
      <p class="mt-4 text-lg">Conectando pessoas a serviços de qualidade na nossa cidade!</p>
      <a :href="loggedIn ? '/protected/me' : '/login' ">
        <Button label="Comece Agora" class="p-button-rounded mt-6" />
      </a>
    </section>

    <section class="container mx-auto py-10 px-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Serviços Disponíveis</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="loading" v-for="n in 6" :key="n" class="bg-gray-200 rounded-lg p-6 animate-pulse">
          <div class="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-300 rounded mb-3"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div class="h-8 bg-gray-300 rounded w-1/4 mb-3"></div>
          <div class="h-10 bg-gray-300 rounded mt-6"></div>
        </div>

        <div v-else v-for="servico in servicos" :key="servico.id"
          class="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <h3 class="text-lg font-semibold text-blue-600 mb-2">{{ servico.titulo }}</h3>
          <p class="text-gray-700 flex-1">{{ servico.descricao }}</p>
          <p class="text-gray-600 mt-4 text-sm">
            Categoria: <span class="font-semibold">{{ servico.categoria.nome }}</span>
          </p>
          <p class="text-gray-600 text-sm">
            Tipo: <span class="font-semibold">{{ servico.tipo }}</span>
          </p>
          <p class="text-gray-900 font-bold text-lg mt-2">
            {{ servico.preco ? `R$ ${servico.preco.toFixed(2)}` : "Preço sob consulta" }}
          </p>
          <div class="flex items-center mt-4">
            <Avatar :image="mockLogo" class="mr-3" size="large" />
            <p class="text-gray-800">
              Oferecido por <span class="font-semibold">{{ servico.usuario.nome }}</span>
            </p>
          </div>
          <NuxtLink :to="`/servico/${servico.id}`">
            <Button label="Ver Detalhes" class="p-button-sm mt-6 self-end" :href="`/details/${servico.id}`" />
          </NuxtLink>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import mockLogo from "~/assets/usermock.png";
import logo from '/logo-removebg-preview.png'
const { loggedIn } = useUserSession();
useHead({
  title: "Conecta Fortaleza",
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: logo,
    },
  ],
  meta: [
    {
      name: "description",
      content: "Conectando pessoas a serviços de qualidade na nossa cidade!",
    },
  ],
})
const servicos = ref([]);
const loading = ref(true);
const loadServicos = async () => {
  try {
    const response = await $fetch("/servicos");
    servicos.value = response.servicos;
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  } finally {
    loading.value = false; 
  }
}

onMounted(() => {
loadServicos()
});
</script>

<style>
</style>
