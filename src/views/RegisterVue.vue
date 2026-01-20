<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Crear cuenta</h1>

      <form @submit.prevent="handleRegister">
        <input v-model="name" placeholder="Nombre completo" />
        <input v-model="email" type="email" placeholder="Correo electrónico" />
        <input v-model="password" type="password" placeholder="Contraseña" />

        <button :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="auth-footer">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/AuthService'

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

const handleRegister = async () => {
  loading.value = true
  try {
    const user = await AuthService.register(name.value, email.value, password.value)
    if (user) router.push('/login')
  } catch {
    error.value = 'Error al registrar'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100svh;
  background: linear-gradient(180deg, #8fa2f2 0%, #e4e9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  padding: 2.2rem;
  border-radius: 16px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
  animation: fadeUp 0.4s ease;
}

/* Título */
.auth-card h1 {
  text-align: center;
  margin-bottom: 1.6rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #2d3748;
}

/* Inputs */
.auth-card input {
  width: 100%;
  padding: 0.8rem 0.9rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  font-size: 0.95rem;
  transition: border 0.2s, box-shadow 0.2s;
}

.auth-card input::placeholder {
  color: #a0aec0;
}

.auth-card input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
}

/* Botón */
.auth-card button {
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(180deg, #667eea, #5a67d8);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.auth-card button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.35);
}

.auth-card button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Texto inferior */
.auth-footer {
  margin-top: 1.3rem;
  text-align: center;
  font-size: 0.9rem;
  color: #4a5568;
}

.auth-footer a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Error */
.error {
  color: #e53e3e;
  text-align: center;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

/* Loading */
.loading-text {
  text-align: center;
  margin-top: 0.8rem;
  font-size: 0.85rem;
  color: #718096;
}

/* Spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255,255,255,0.4);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Animaciones */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
