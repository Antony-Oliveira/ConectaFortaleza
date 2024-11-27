<template>
  <div
    class="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50"
  >
    <section class="container mx-auto py-12 px-6">
      <!-- Loading Placeholder -->
      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="h-8 bg-gray-300 rounded w-3/4"></div>
        <div class="h-5 bg-gray-300 rounded w-1/2"></div>
        <div class="h-6 bg-gray-300 rounded w-3/4"></div>
        <div class="h-10 bg-gray-300 rounded w-1/4"></div>
        <div class="h-12 bg-gray-300 rounded mt-6"></div>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
        <!-- Informações do Usuário -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border-b-2 border-gray-200 pb-6">
          <Avatar :image="mockLogo" class="sm:mr-6" size="lg" />
          <div>
            <h2 class="text-2xl sm:text-4xl font-semibold text-gray-800">
              {{ servico.usuario.nome }}
            </h2>
            <p class="text-gray-500 text-sm sm:text-lg mt-2">
              {{ servico.usuario.bio || "Sem bio" }}
            </p>
            <p class="text-gray-800 text-sm sm:text-lg mt-2">
              {{ servico.usuario.email }}
            </p>
          </div>
        </div>

        <!-- Informações do Serviço -->
        <div class="bg-gradient-to-r from-indigo-100 to-blue-100 p-4 sm:p-6 rounded-xl shadow-lg">
          <h1 class="text-2xl sm:text-4xl font-bold text-blue-600">
            {{ servico.titulo }}
          </h1>
          <p class="text-gray-700 text-sm sm:text-xl mt-2">
            {{ servico.descricao }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="flex items-center space-x-2 sm:space-x-4">
              <span class="text-sm sm:text-lg text-gray-600 font-semibold">
                Categoria:
              </span>
              <span class="text-sm sm:text-lg text-blue-500">
                {{ servico.categoria.nome }}
              </span>
            </div>
            <div class="flex items-center space-x-2 sm:space-x-4">
              <span class="text-sm sm:text-lg text-gray-600 font-semibold">
                Tipo:
              </span>
              <span class="text-sm sm:text-lg text-blue-500">
                {{ servico.tipo }}
              </span>
            </div>
            <div class="flex items-center space-x-2 sm:space-x-4">
              <span class="text-sm sm:text-lg text-gray-600 font-semibold">
                Disponibilidade:
              </span>
              <span class="text-sm sm:text-lg text-blue-500">
                {{ formatDataDisponibilidade(servico.disponibilidade) }}
              </span>
            </div>
            <div class="flex items-center space-x-2 sm:space-x-4">
              <span class="text-sm sm:text-lg text-gray-600 font-semibold">
                Preço:
              </span>
              <span class="text-lg sm:text-xl font-bold text-gray-900">
                {{ servico.preco ? `R$ ${servico.preco.toFixed(2)}` : "Sob consulta" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Avaliação -->
        <div
          v-if="user && servico.usuario.id !== user.id"
          class="mt-8 p-4 sm:p-6 bg-white shadow-lg rounded-xl"
        >
          <h3 class="text-xl sm:text-2xl font-semibold text-gray-800">
            Deixe sua Avaliação
          </h3>
          <div class="space-y-4 mt-4">
            <Rating v-model="nota" cancel="false" :stars="5" class="text-2xl w-32 sm:text-3xl sm:w-40" />

            <TextArea
              v-model="comentario"
              placeholder="Escreva seu comentário aqui..."
              class="w-full p-2 sm:p-4 border rounded-xl"
              rows="3"
            ></TextArea>

            <button
              @click="enviarAvaliacao"
              class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl mt-4 hover:bg-blue-700 transition-all"
            >
              Enviar Avaliação
            </button>
          </div>
        </div>

        <!-- Avaliações -->
        <div
          v-if="servico.avaliacoes && servico.avaliacoes.length > 0"
          class="mt-8"
        >
          <h2 class="text-lg sm:text-2xl font-semibold text-gray-800">
            Avaliações
          </h2>
          <div
            v-for="avaliacao in servico.avaliacoes"
            :key="avaliacao.id"
            class="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-center space-x-4">
              <Avatar :image="mockLogo" size="large" />
              <div>
                <h4 class="text-sm sm:text-lg font-semibold text-gray-800">
                  {{ avaliacao.usuario.nome }}
                </h4>
                <p class="text-xs sm:text-sm text-gray-500">
                  {{ formatDataDisponibilidade(avaliacao.data) }}
                </p>
              </div>
            </div>

            <div class="mt-3">
              <Rating
                v-model="avaliacao.nota"
                :cancel="false"
                :stars="5"
                :readonly="true"
                class="text-2xl sm:text-3xl"
              />
            </div>

            <p v-if="avaliacao.comentario" class="mt-4 text-sm sm:text-base text-gray-600">
              {{ avaliacao.comentario }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import { ref, onMounted, Text } from "vue";
import { useRoute } from "vue-router";
import mockLogo from "../../assets/usermock.png";

const route = useRoute();
const { user, loggedIn } = useUserSession();

const servico = ref(null);
const loading = ref(true);
const nota = ref(0);
const comentario = ref("");
const formatDataDisponibilidade = (data) => {
  if (!data) return "Sob consulta";

  const date = new Date(data);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

const enviarAvaliacao = async () => {
  if (nota.value === 0 || !comentario.value.trim()) {
    alert("Por favor, avalie o serviço e adicione um comentário!");
    return;
  }

  try {
    const response = await $fetch(`/postAvaliacao`, {
      method: "POST",
      body: JSON.stringify({
        servicoId: servico.value.id,
        usuarioId: route.params.userId,
        nota: nota.value,
        comentario: comentario.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.success) {
      alert("Avaliação enviada com sucesso!");
      servico.value.avaliacoes.push({
        id: response.novaAvaliacao.id,
        usuario: { nome: response.novaAvaliacao.usuario.nome },
        nota: response.novaAvaliacao.nota,
        comentario: response.novaAvaliacao.comentario,
        data: new Date(),
      });
      nota.value = 0;
      comentario.value = "";
    } else {
      alert("Erro ao enviar avaliação. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    alert("Erro ao enviar avaliação.");
  }
};

onMounted(() => getServico());
</script>

<style>
.p-rating {
  --p-rating-gap: 0.5rem;
}

.p-rating {
  --p-rating-transition-duration: 0.3s;
}

.p-rating {
  --p-rating-focus-ring-width: 3px;
  --p-rating-focus-ring-style: solid;
  --p-rating-focus-ring-color: #ff5722;
  --p-rating-focus-ring-offset: 4px;
  --p-rating-focus-ring-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
}

.p-rating {
  --p-rating-icon-size: 2rem;
}

.p-rating {
  --p-rating-icon-color: #e0e0e0;
}
.p-rating {
  --p-rating-icon-hover-color: #ff5722;
}
.p-rating {
  --p-rating-icon-active-color: #ff9800;
}
</style>
