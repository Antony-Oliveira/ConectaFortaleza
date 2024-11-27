<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div
      v-if="loadingUser"
      class="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 animate-pulse"
    >
      <div class="h-16 w-16 bg-gray-300 rounded-full mb-6"></div>
      <div class="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
      <div class="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
      <div class="h-5 bg-gray-300 rounded w-full mb-4"></div>
    </div>
    <div v-else class="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
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
              <i class="pi pi-phone text-lg mr-2"></i
              >{{ user.telefone || "Não informado" }}
            </span>
            <span class="flex items-center text-gray-500">
              <i class="pi pi-map-marker text-lg mr-2"></i
              >{{ user.localizacao || "Localização não informada" }}
            </span>
          </div>
          <Button
            label="Editar Perfil"
            icon="pi pi-pencil"
            class="p-button-sm p-button-outlined mt-4"
            @click="openEditDialog"
          />
        </div>
      </div>

      <div v-if="user.bio" class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Sobre Mim</h2>
        <p class="text-gray-700">{{ user.bio }}</p>
      </div>

      <!-- Diálogo de edição -->
      <Dialog
        v-model:visible="editUserDialog"
        header="Editar Perfil"
        :style="{ width: '450px' }"
        :closable="false"
        modal
      >
        <form @submit.prevent="updateUser">
          <div class="mb-4">
            <label for="nome" class="block text-gray-700 font-medium mb-1"
              >Nome</label
            >
            <InputText v-model="form.nome" id="nome" class="w-full" />
          </div>
          <div class="mb-4">
            <label for="telefone" class="block text-gray-700 font-medium mb-1"
              >Telefone</label
            >
            <InputMask v-model="form.telefone" id="telefone" class="w-full" mask="(99) 99999-9999" />
          </div>
          <div class="mb-4">
            <label for="bio" class="block text-gray-700 font-medium mb-1"
              >Biografia</label
            >
            <Textarea v-model="form.bio" id="bio" rows="3" class="w-full" />
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <Button
              label="Cancelar"
              class="p-button-text"
              @click="editUserDialog = false"
            />
            <Button label="Salvar" class="p-button-primary" type="submit" />
          </div>
        </form>
      </Dialog>

      <!-- Modal para Criar Serviço -->
      <Dialog
        v-model:visible="newServiceDialog"
        header="Criar Serviço"
        :style="{ width: '500px' }"
        modal
      >
        <form @submit.prevent="createService">
          <!-- Título -->
          <div class="mb-4">
            <label for="titulo" class="block text-gray-700 font-medium mb-1"
              >Título</label
            >
            <InputText
              v-model="newService.titulo"
              id="titulo"
              class="w-full"
              required
            />
          </div>

          <!-- Descrição -->
          <div class="mb-4">
            <label for="descricao" class="block text-gray-700 font-medium mb-1"
              >Descrição</label
            >
            <Textarea
              v-model="newService.descricao"
              id="descricao"
              rows="3"
              class="w-full"
              required
            />
          </div>

          <div class="mb-4">
            <label for="tipo" class="block text-gray-700 font-medium mb-1"
              >Tipo</label
            >
            <InputText
              v-model="newService.tipo"
              id="tipo"
              class="w-full"
              required
            />
          </div>
          <!-- Preço -->
          <div class="mb-4">
            <label for="preco" class="block text-gray-700 font-medium mb-1"
              >Preço</label
            >
            <InputNumber
              v-model="newService.preco"
              id="preco"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              class="w-full"
            />
          </div>

          <!-- Categoria -->
          <div class="mb-4">
            <label for="categoria" class="block text-gray-700 font-medium mb-1"
              >Categoria</label
            >
            <Select
              v-model="newService.categoriaId"
              :options="categorias"
              optionLabel="nome"
              optionValue="id"
              placeholder="Selecione uma Categoria" class="w-full"
              :filter="true" >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  {{
                    categorias.find(
                      (categoria) => categoria.id === slotProps.value
                    )?.nome || "Selecione uma Categoria"
                  }}
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div>{{ slotProps.option.nome }}</div>
              </template>
            </Select>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <Button
              label="Cancelar"
              class="p-button-text"
              @click="newServiceDialog = false"
            />
            <Button label="Salvar" class="p-button-primary" type="submit" />
          </div>
        </form>
      </Dialog>

      <!-- Modal para Editar Serviço -->
      <Dialog
        v-model:visible="editServiceDialog"
        header="Editar Serviço"
        :style="{ width: '500px' }"
        modal
      >
        <form @submit.prevent="updateService">
          <!-- Título -->
          <div class="mb-4">
            <label for="titulo" class="block text-gray-700 font-medium mb-1"
              >Título</label
            >
            <InputText
              v-model="editServiceData.titulo"
              id="titulo"
              class="w-full"
              required
            />
          </div>

          <!-- Descrição -->
          <div class="mb-4">
            <label for="descricao" class="block text-gray-700 font-medium mb-1"
              >Descrição</label
            >
            <Textarea
              v-model="editServiceData.descricao"
              id="descricao"
              rows="3"
              class="w-full"
              required
            />
          </div>

          <div class="mb-4">
            <label for="tipo" class="block text-gray-700 font-medium mb-1"
              >Tipo</label
            >
            <InputText
              v-model="editServiceData.tipo"
              id="tipo"
              class="w-full"
              required
            />
          </div>

          <!-- Preço -->
          <div class="mb-4">
            <label for="preco" class="block text-gray-700 font-medium mb-1"
              >Preço</label
            >
            <InputNumber
              v-model="editServiceData.preco"
              id="preco"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              class="w-full"
            />
          </div>

          <!-- Categoria -->
          <div class="mb-4">
            <label for="categoria" class="block text-gray-700 font-medium mb-1"
              >Categoria</label
            >
            <Select
              v-model="editServiceData.categoriaId"
              :options="categorias"
              optionLabel="nome"
              optionValue="id"
              placeholder="Selecione uma Categoria"
              class="w-full"
              :filter="true"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  {{
                    categorias.find(
                      (categoria) => categoria.id === slotProps.value
                    )?.nome || "Selecione uma Categoria"
                  }}
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div>{{ slotProps.option.nome }}</div>
              </template>
            </Select>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <Button
              label="Cancelar"
              class="p-button-text"
              @click="editServiceDialog = false"
            />
            <Button
              label="Excluir"
              icon="pi pi-trash"
              class="p-button-danger p-button-outlined"
              @click="deleteService"
            />
            <Button label="Salvar" class="p-button-primary" type="submit" />
          </div>
        </form>
      </Dialog>

      <div class="mt-10">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Meus Serviços</h2>
        <div class="flex justify-end mb-6">
          <Button
            label="Criar Serviço"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="openServiceDialog"
          />
        </div>
        <div
          v-if="user.servicos?.length"
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card
            v-for="servico in user.servicos"
            :key="servico.id"
            class="shadow-md"
          >
            <template #title>{{ servico.titulo }}</template>
            <template #content>
              <p>{{ servico.descricao }}</p>
            </template>
            <template #footer>
              <div class="flex justify-between items-center">
                <span class="text-sm ">
                  R$
                  {{
                    servico.preco ? servico.preco.toFixed(2) : "Sob consulta"
                  }}
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
definePageMeta({
  middleware: "auth",
});
const id = useUserSession().user.value.id;
const user = ref(null);
const loadingUser = ref(true);
const editUserDialog = ref(false);
const newServiceDialog = ref(false);
const editServiceDialog = ref(false);
const categorias = ref([]);
const form = reactive({ nome: "", telefone: "", bio: "" });
const newService = reactive({
  titulo: "",
  descricao: "",
  tipo: "",
  preco: null,
  categoriaId: null,
});
const editServiceData = reactive({
  id: null,
  titulo: "",
  descricao: "",
  tipo: "",
  preco: null,
  categoriaId: null,
});

const openServiceDialog = () => {
  newService.titulo = "";
  newService.descricao = "";
  newService.preco = null;
  newServiceDialog.value = true;
};

const createService = async () => {
  console.log("novo servico", newService);

  try {
    const response = await $fetch("/createService", {
      method: "POST",
      body: newService,
    });
    user.value.servicos.push(response.servico);
    newServiceDialog.value = false;
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
  }
};

const editService = (servico) => {
  editServiceData.id = servico.id;
  editServiceData.titulo = servico.titulo;
  editServiceData.descricao = servico.descricao;
  editServiceData.tipo = servico.tipo;
  editServiceData.preco = servico.preco;
  editServiceData.categoriaId = servico.categoriaId;
  editServiceDialog.value = true;
  console.log(servico);
  
};

const updateService = async () => {
  try {
    const response = await $fetch(`/updateService/${editServiceData.id}`, {
      method: "PUT",
      body: editServiceData
    });
    const index = user.value.servicos.findIndex(
      (s) => s.id === editServiceData.id
    );
    if (index !== -1) {
      user.value.servicos[index] = response.servico;
    }
    editServiceDialog.value = false;
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
  }
};

const deleteService = async () => {
  try {
    const confirmed = confirm("Tem certeza que deseja excluir este serviço?");
    if (!confirmed) return;

    await $fetch(`/deleteService/${editServiceData.id}`, {
      method: "DELETE",
    });

    const index = user.value.servicos.findIndex(
      (s) => s.id === editServiceData.id
    );
    if (index !== -1) {
      user.value.servicos.splice(index, 1); 
    }

    alert("Serviço excluído com sucesso.");
    editServiceDialog.value = false;
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    alert("Ocorreu um erro ao tentar excluir o serviço.");
  }
};

const openEditDialog = () => {
  form.nome = user.value.nome;
  form.telefone = user.value.telefone;
  form.bio = user.value.bio;
  editUserDialog.value = true;
};

const fetchUser = async () => {
  try {
    const response = await $fetch("/me", {
      method: "POST",
      body: { id: id },
    });
    user.value = response.user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
  } finally {
    loadingUser.value = false;
  }
};

const fetchCategorias = async () => {
  try {
    const response = await $fetch("/categorias");
    console.log(response.categories);

    categorias.value = response.categories;
    console.log(categorias.value);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
};
const updateUser = async () => {
  try {
    const response = await $fetch("/updateUser", {
      method: "PUT",
      body: form,
    });
    Object.assign(user.value, response.user);
    editUserDialog.value = false;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
  }
};

onMounted(() => {
  fetchUser();
  fetchCategorias();
});
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
