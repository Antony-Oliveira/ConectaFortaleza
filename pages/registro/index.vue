<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <!-- Card de Registro -->
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Crie sua conta</h2>
  
        <form @submit.prevent="handleRegister">
          <!-- Nome -->
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
  
          <!-- Email -->
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
  
          <!-- Senha -->
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
  
          <!-- Telefone -->
          <div class="mb-4">
            <label for="telefone" class="block text-gray-700 font-medium mb-2">Telefone</label>
            <InputText
              v-model="form.telefone"
              id="telefone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              class="w-full"
            />
          </div>
  
          <!-- Localização -->
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
  
          <!-- Botão de Registro -->
          <div class="mt-6">
            <Button
              :loading="isSubmitting"
              label="Registrar"
              type="submit"
              class="w-full p-button-success p-button-rounded"
            />
          </div>
        </form>
  
        <!-- Texto com Link -->
        <div class="text-center mt-4">
          <p class="text-gray-600">
            Já tem uma conta? 
            <NuxtLink to="/login" class="text-blue-500 hover:underline">Entre aqui</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  definePageMeta({
    title: 'Registro',
    pageTransition: {type: "transition", duration: 1000},

  });
  const form = ref({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    localizacao: '',
  });

  const isSubmitting = ref(false);
  
  const handleRegister = async () => {
    isSubmitting.value = true;
    try {
      const response = await $fetch('/auth/registro', {
        method: 'POST',
        body: form.value,
      });
  
      console.log('Registro bem-sucedido:', response);
      navigateTo('/'); 
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Não foi possível completar o registro. Tente novamente.');
    }finally{
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Ajuste para campo de senha */
  .p-password input {
    width: 100%;
  }
  </style>
  