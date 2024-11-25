<template>
    <div class="min-h-screen bg-gray-50 py-10">
      <div class="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <!-- Cabeçalho com Avatar e Dados do Usuário -->
        <div class="flex items-center gap-8 mb-8">
          <Avatar 
            :image="user.avatarUrl || 'https://via.placeholder.com/150'" 
            size="xlarge" 
            shape="circle" 
            class="shadow-md"
          />
          <div>
            <h1 class="text-4xl font-bold text-gray-800">{{ user.nome }}</h1>
            <p class="text-lg text-gray-600">{{ user.email }}</p>
            <div class="flex items-center gap-4 mt-4">
              <span class="flex items-center text-gray-500">
                <i class="pi pi-phone text-lg mr-2"></i>{{ user.telefone || 'Não informado' }}
              </span>
              <span class="flex items-center text-gray-500">
                <i class="pi pi-map-marker text-lg mr-2"></i>{{ user.localizacao || 'Localização não informada' }}
              </span>
            </div>
            <Button 
              label="Editar Perfil" 
              icon="pi pi-pencil" 
              class="p-button-sm p-button-outlined mt-4"
              @click="editUserDialog = true"
            />
          </div>
        </div>
  
        <!-- Seção de Biografia -->
        <div v-if="user.bio" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Sobre Mim</h2>
          <p class="text-gray-700">{{ user.bio }}</p>
        </div>
  
        <!-- Modal para Editar Dados -->
        <Dialog 
          v-model:visible="editUserDialog" 
          header="Editar Perfil" 
          :style="{ width: '450px' }" 
          :closable="false"
          modal>
          <form @submit.prevent="updateUser">
            <div class="mb-4">
              <label for="nome" class="block text-gray-700 font-medium mb-1">Nome</label>
              <InputText v-model="form.nome" id="nome" class="w-full" />
            </div>
            <div class="mb-4">
              <label for="telefone" class="block text-gray-700 font-medium mb-1">Telefone</label>
              <InputText v-model="form.telefone" id="telefone" class="w-full" />
            </div>
            <div class="mb-4">
              <label for="bio" class="block text-gray-700 font-medium mb-1">Biografia</label>
              <Textarea v-model="form.bio" id="bio" rows="3" class="w-full" />
            </div>
            <div class="flex justify-end gap-3 mt-4">
              <Button 
                label="Cancelar" 
                class="p-button-text" 
                @click="editUserDialog = false"
              />
              <Button 
                label="Salvar" 
                class="p-button-primary"
                type="submit"
              />
            </div>
          </form>
        </Dialog>
  
        <!-- Seção de Serviços -->
        <div class="mt-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Meus Serviços</h2>
          <div class="flex justify-end mb-6">
            <Button 
              label="Criar Serviço" 
              icon="pi pi-plus" 
              class="p-button-primary" 
              @click="newServiceDialog = true"
            />
          </div>
          <div v-if="user.servicos?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              v-for="servico in user.servicos" 
              :key="servico.id" 
              class="shadow-md"
            >
              <template #title>
                {{ servico.titulo }}
              </template>
              <template #content>
                <p>{{ servico.descricao }}</p>
              </template>
              <template #footer>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">
                    R$ {{ servico.preco || 'Sob consulta' }}
                  </span>
                  <Button 
                    label="Editar" 
                    icon="pi pi-pencil" 
                    class="p-button-sm p-button-outlined p-button-secondary"
                    @click="editService(servico)"
                  />
                </div>
              </template>
            </Card>
          </div>
          <div v-else class="text-gray-600 text-center">
            <p>Você ainda não possui serviços cadastrados.</p>
          </div>
        </div>
  
        <!-- Modal para Criar Serviço -->
        <Dialog 
          v-model:visible="newServiceDialog" 
          header="Criar Serviço" 
          :style="{ width: '500px' }" 
          modal>
          <form @submit.prevent="createService">
            <div class="mb-4">
              <label for="titulo" class="block text-gray-700 font-medium mb-1">Título</label>
              <InputText v-model="newService.titulo" id="titulo" class="w-full" />
            </div>
            <div class="mb-4">
              <label for="descricao" class="block text-gray-700 font-medium mb-1">Descrição</label>
              <Textarea v-model="newService.descricao" id="descricao" rows="3" class="w-full" />
            </div>
            <div class="mb-4">
              <label for="preco" class="block text-gray-700 font-medium mb-1">Preço</label>
              <InputNumber v-model="newService.preco" id="preco" mode="currency" currency="BRL" locale="pt-BR" class="w-full" />
            </div>
            <div class="flex justify-end gap-3 mt-4">
              <Button 
                label="Cancelar" 
                class="p-button-text" 
                @click="newServiceDialog = false"
              />
              <Button 
                label="Salvar" 
                class="p-button-primary"
                type="submit"
              />
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  </template>
  

<script setup>
definePageMeta({
  path: "/me",
  middleware: "auth",
});
// Usuário logado
const { user } = useUserSession();

const editUserDialog = ref(false);
const newServiceDialog = ref(false);

const form = reactive({
  nome: user.value.nome,
  telefone: user.value.telefone,
  bio: user.value.bio,
});

const newService = reactive({
  titulo: "",
  descricao: "",
  preco: null,
});

const updateUser = async () => {
  try {
    console.log("Atualizando usuário:", form);
    const response = await $fetch(`/updateUser`, {
      method: "PUT",
      body: form,
    });
    console.log("Usuário atualizado com sucesso:", response);
    Object.assign(user.value, response.user);
    editUserDialog.value = false;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
  }
};

const createService = () => {
  console.log("Criando serviço:", newService);
  newServiceDialog.value = false;
};

const editService = (servico) => {
  console.log("Editar serviço:", servico);
};
</script>

<style scoped>
/* Estilos adicionais para inputs e formulários */
textarea {
  resize: none;
}
</style>
