<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <!-- Card de Registro -->
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Crie sua conta</h2>

      <!-- Exibir erro de validação -->
      <div v-if="errorMessage" class="text-red-500 text-center mb-4">
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="nome" class="block text-gray-700 font-medium mb-2">Nome Completo</label>
          <InputText
            v-model="form.nome"
            id="nome"
            type="text"
            placeholder="Digite seu nome"
            class="w-full"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <InputText
            v-model="form.email"
            id="email"
            type="email"
            placeholder="Digite seu email"
            class="w-full"
            required
          />
        </div>

        <div class="mb-4">
          <label for="senha" class="block text-gray-700 font-medium mb-2">Senha</label>
          <Password
            v-model="form.senha"
            id="senha"
            toggleMask
            placeholder="Digite sua senha"
            class="w-full"
            required
            promptLabel="Digite uma senha forte" weakLabel="Muito simples" mediumLabel="Quase boa..." strongLabel="Uma ótima senha!"
          />
        </div>

        <div class="mb-4">
          <label for="telefone" class="block text-gray-700 font-medium mb-2">Telefone</label>
          <InputMask
            v-model="form.telefone"
            id="telefone"
            type="tel"
            placeholder="(XX) XXXXX-XXXX"
            class="w-full"
            mask="(99) 99999-9999"
          />
        </div>

        <div class="mb-4">
          <label for="localizacao" class="block text-gray-700 font-medium mb-2">Localização</label>
          <InputText
            v-model="form.localizacao"
            id="localizacao"
            type="text"
            placeholder="Digite sua localização"
            class="w-full"
          />
        </div>

        <div class="mt-6">
          <Button
            :loading="isSubmitting"
            label="Registrar"
            type="submit"
            class="w-full p-button-success p-button-rounded"
          />
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-gray-600">
          Já tem uma conta? 
          <NuxtLink to="/login" class="text-blue-500 hover:underline">Entre aqui</NuxtLink>
        </p>
      </div>
      <div class="text-center mt-4">
        <a href="/" class="text-blue-500 hover:underline">Voltar para a página inicial</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  title: 'Registro',
  pageTransition: { type: "transition", duration: 1000 },
});

const form = ref({
  nome: '',
  email: '',
  senha: '',
  telefone: '',
  localizacao: '',
});

const isSubmitting = ref(false);
const errorMessage = ref(null); // Variável para armazenar mensagens de erro

const handleRegister = async () => {
  isSubmitting.value = true;
  errorMessage.value = null; // Limpa qualquer mensagem de erro anterior

  try {
    const response = await $fetch('/auth/registro', {
      method: 'POST',
      body: form.value,
    });

    if (response.status !== 200) {
      errorMessage.value = response.message || 'Erro desconhecido. Tente novamente.';
    } else {
      console.log('Registro bem-sucedido:', response);
      window.location.href = '/'; 
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    errorMessage.value = 'Não foi possível completar o registro. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.p-password input {
  width: 100%;
}
</style>
