<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Bem-vindo!</h2>

      <p class="text-gray-600 text-center mb-4">Entre para continuar</p>

      <!-- Exibir erro de validação -->
      <div v-if="errorMessage" class="text-red-500 text-center mb-4">
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
          <InputText v-model="form.email" id="email" type="email" placeholder="Digite seu email" class="w-full" required />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700 font-medium mb-2">Senha</label>
          <Password v-model="form.senha" id="password" toggleMask placeholder="Digite sua senha" class="w-full" required :feedback="false" />
        </div>

        <div class="mt-6">
          <Button label="Entrar" type="submit" class="w-full p-button-primary p-button-rounded" :loading="isSubmitting"/>
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-gray-600">
          Não tem uma conta?
          <NuxtLink to="/registro" class="text-blue-500 hover:underline">Cadastre-se</NuxtLink>
        </p>
      </div>
      <div class="text-center mt-4">
        <a href="/" class="text-blue-500 hover:underline">Voltar para a página inicial</a>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Login",
})

const form = ref({
  email: '',
  senha: '',
});

const router = useRouter()
const isSubmitting = ref(false)
const errorMessage = ref(null) 

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = null 

  try {
    const response = await $fetch("/auth/login", {
      body: form.value,
      method: "POST"
    });

    if (response.success) {
      console.log(response.user);
      window.location.href = "/"
    } else {
      errorMessage.value = response.message || "Erro desconhecido. Tente novamente."
    }
  } catch (error) {
    errorMessage.value = error.message || "Erro ao realizar o login."
  } finally {
    isSubmitting.value = false;
  }
};
</script>


<style>
.p-password-full {
  display: block;
  width: 100%;
}

.p-password {
  display: block;
  width: 100%;
}

.p-password input {
  width: 100%;
}

.p-password .p-password-toggle-icon {
  right: 1rem;
}
</style>