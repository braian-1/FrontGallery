<template>
  <div class="gallery">
    <header class="gallery-header">
      <h2>Galería de Imágenes</h2>
      <button class="logout-btn" @click="handleLogout">Cerrar sesión</button>
    </header>

    <!-- SOLO ADMIN -->
    <form v-if="isAdmin" class="upload-box" @submit.prevent="uploadImage">
      <input type="file" @change="handleFileChange" accept="image/*" />
      <button type="submit" :disabled="!selectedFile">
        ⬆ Subir imagen
      </button>
    </form>

    <div v-if="images.length === 0" class="empty">
      No hay imágenes disponibles
    </div>

    <div class="image-grid">
      <div v-for="image in images" :key="image.id" class="image-card">
        <img :src="image.url" :alt="image.name" />

        <div class="card-body">
          <p class="image-name">{{ image.name }}</p>

          <!-- SOLO ADMIN -->
          <button
            v-if="isAdmin"
            class="delete-btn"
            @click="deleteImage(image.id)"
          >
            🗑 Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/http";
import { AuthService } from "@/services/AuthService";

const images = ref<any[]>([]);
const selectedFile = ref<File | null>(null);
const currentUser = ref<any>(null);

const router = useRouter();

/* 🔒 ADMIN CHECK */
const isAdmin = computed(() => {
  return currentUser.value?.role?.toLowerCase() === "admin";
});

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
  }
};

const fetchImages = async () => {
  try {
    const res = await api.get("/image");
    images.value = res.data;
  } catch (err) {
    console.error("Error al cargar imágenes", err);
  }
};

const uploadImage = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append("File", selectedFile.value); // Debe coincidir con el backend

  try {
    await api.post("/image/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    selectedFile.value = null;
    await fetchImages();
  } catch (err) {
    console.error("Error al subir imagen", err);
  }
};

const deleteImage = async (id: number) => {
  try {
    await api.delete(`/image/${id}`);
    images.value = images.value.filter((img) => img.id !== id);
  } catch (err) {
    console.error("Error al eliminar imagen", err);
  }
};

const handleLogout = () => {
  AuthService.logout();
  router.push("/login");
};

onMounted(async () => {
  const user = AuthService.getCurrentUser();
  currentUser.value = user;

  await fetchImages();
});
</script>

<style scoped>
.gallery {
  max-width: 1200px;
  margin: auto;
  padding: 1.5rem;
}

/* Header con título y botón logout */
.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.gallery-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
}

.logout-btn {
  padding: 0.4rem 1rem;
  border-radius: 10px;
  border: none;
  background: #e53e3e;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: #c53030;
}

/* ========================= */
/* SUBIR IMAGEN (ADMIN) */
/* ========================= */
.upload-box {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.upload-box input[type="file"] {
  border: 1px dashed #a0aec0;
  padding: 0.6rem;
  border-radius: 8px;
  background: #f7fafc;
}

.upload-box button {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(180deg, #667eea, #5a67d8);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.upload-box button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.upload-box button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========================= */
/* GRID */
/* ========================= */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* ========================= */
/* CARD */
/* ========================= */
.image-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}

.image-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.2);
}

.image-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

/* ========================= */
/* CARD BODY */
/* ========================= */
.card-body {
  padding: 0.9rem;
  text-align: center;
}

.image-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.6rem;
}

/* ========================= */
/* BOTÓN ELIMINAR */
/* ========================= */
.delete-btn {
  width: 100%;
  padding: 0.45rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(180deg, #f56565, #e53e3e);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(229, 62, 62, 0.4);
}

/* ========================= */
/* EMPTY */
/* ========================= */
.empty {
  text-align: center;
  color: #718096;
  margin-top: 2rem;
}
</style>
