<template>
  <div class="min-h-screen bg-gray-50">
   
    <section class="container mx-auto py-10 px-6">
      
      <div v-if="loading" class="animate-pulse">
        <div class="h-5 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-300 rounded mb-3"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div class="h-8 bg-gray-300 rounded w-1/4 mb-3"></div>
        <div class="h-10 bg-gray-300 rounded mt-6"></div>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <Avatar :image="mockLogo" class="mr-3" size="large" />
          <p class="text-gray-800 text-5xl p-2">
            <span class="font-semibold">{{ servico.usuario.nome }}</span>
          </p>
        </div>
        <h1 class="text-3xl font-bold text-blue-600 mb-4">{{ servico.titulo }}</h1>
        <p class="text-gray-700 mb-6">{{ servico.descricao }}</p>
        <p class="text-gray-600 text-sm mb-2">
          Contato: <span class="font-semibold text-gray-700">{{ servico.usuario.telefone }}</span>
        </p>
        <p class="text-gray-600 text-sm mb-2">
          Email: <span class="font-semibold text-gray-700">{{ servico.usuario.email }}</span>
        </p>
        <p class="text-gray-600 text-sm mb-2">
          Localização: <span class="font-semibold text-gray-700">{{ servico.usuario.localizacao || "Não informado" }}</span>
        </p>
        <p class="text-gray-600 text-sm mb-2">
          Categoria: <span class="font-semibold">{{ servico.categoria.nome }}</span>
        </p>
        <p class="text-gray-600 text-sm mb-2">
          Tipo: <span class="font-semibold">{{ servico.tipo }}</span>
        </p>
        <p class="text-gray-600 text-sm mb-2">
          Disponibilidade: <span class="font-semibold">{{ formatDataDisponibilidade(servico.disponibilidade) }}</span>

        </p>
        <p class="text-gray-900 font-bold text-xl mb-4">
          {{ servico.preco ? `R$ ${servico.preco.toFixed(2)}` : "Preço sob consulta" }}
        </p>
        <div v-if="servico.avaliacoes && servico.avaliacoes.length > 0" class="mt-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Avaliações</h2>
          <div v-for="avaliacao in servico.avaliacoes" :key="avaliacao.id" class="mb-4">
            <p class="text-gray-700 mb-2"><span class="font-semibold">{{ avaliacao.usuario }}</span> - {{ formatDataDisponibilidade(avaliacao.data) }}</p>
            <!-- Exibir Estrelas -->
            <div class="flex items-center">
              <span v-for="n in 5" :key="n" :class="getStarClass(n, avaliacao.nota)">
                ★
              </span>
            </div>
            <p class="text-gray-600 mt-2">{{ avaliacao.comentario }}</p>
          </div>
        </div>
      </div>
    </section>
   
    
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import mockLogo from "~/assets/usermock.png";

const route = useRoute();
const servico = ref(null);
const loading = ref(true);

const formatDataDisponibilidade = (data) => {
  if (!data) return "Sob consulta";
  
  const date = new Date(data);
  
  // Formatar como dd/mm/yyyy hh:mm
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
// Função para obter a classe da estrela (preenchida ou vazia)
const getStarClass = (index, nota) => {
  if (index <= nota) {
    return 'text-yellow-500'; // Estrela preenchida
  } else {
    return 'text-gray-300'; // Estrela vazia
  }
};


const getServico = async () => {
  try {
    const response = await $fetch(`/getService/${route.params.id}`);
    servico.value = response.servico;
  } catch (error) {
    console.error("Erro ao carregar serviço:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => getServico());
</script>
