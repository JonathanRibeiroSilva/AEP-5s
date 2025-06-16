<template>
    <div class="login">
        <div class="container">
            <div class="login-card">
                <div class="login-header">
                    <i class="fas fa-user-lock"></i>
                    <h1>Login</h1>
                    <p>Faça login para acessar recursos administrativos</p>
                </div>

                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label for="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            v-model="form.email"
                            required
                            placeholder="Digite seu e-mail"
                            :disabled="loading"
                        />
                    </div>

                    <div class="form-group">
                        <label for="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            v-model="form.password"
                            required
                            placeholder="Digite sua senha"
                            :disabled="loading"
                        />
                    </div>

                    <div v-if="error" class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        {{ error }}
                    </div>

                    <div v-if="success" class="success-message">
                        <i class="fas fa-check-circle"></i>
                        {{ success }}
                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading"
                    >
                        <span v-if="loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            Entrando...
                        </span>
                        <span v-else>
                            <i class="fas fa-sign-in-alt"></i>
                            Entrar
                        </span>
                    </button>
                </form>

                <div class="login-footer">
                    <p>
                        Não tem uma conta?
                        <button
                            @click="showRegister = !showRegister"
                            class="link-btn"
                        >
                            Criar conta
                        </button>
                    </p>
                </div>

                <!-- Formulário de Registro -->
                <div v-if="showRegister" class="register-form">
                    <h2>Criar Nova Conta</h2>
                    <form @submit.prevent="handleRegister">
                        <div class="form-group">
                            <label for="reg-email">E-mail:</label>
                            <input
                                type="email"
                                id="reg-email"
                                v-model="registerForm.email"
                                required
                                placeholder="Digite seu e-mail"
                            />
                        </div>

                        <div class="form-group">
                            <label for="reg-password">Senha:</label>
                            <input
                                type="password"
                                id="reg-password"
                                v-model="registerForm.password"
                                required
                                placeholder="Digite sua senha (min. 6 caracteres)"
                                minlength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            class="btn btn-secondary"
                            :disabled="registerLoading"
                        >
                            <span v-if="registerLoading">
                                <i class="fas fa-spinner fa-spin"></i>
                                Criando...
                            </span>
                            <span v-else>
                                <i class="fas fa-user-plus"></i>
                                Criar Conta
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/api';

export default {
    name: 'Login',
    setup() {
        const router = useRouter();
        const loading = ref(false);
        const registerLoading = ref(false);
        const error = ref('');
        const success = ref('');
        const showRegister = ref(false);

        const form = ref({
            email: '',
            password: '',
        });

        const registerForm = ref({
            email: '',
            password: '',
        });

        const handleLogin = async () => {
            try {
                loading.value = true;
                error.value = '';
                success.value = '';

                const response = await authService.login(form.value);

                localStorage.setItem('token', response.access_token);
                localStorage.setItem('user', JSON.stringify(response.user));

                success.value = 'Login realizado com sucesso!';
                
                // Verifica se o token foi realmente salvo antes de redirecionar
                const token = localStorage.getItem('token');
                if (token) {
                    if (response.user.role === 'admin') {
                        router.push('/dashboard');
                    } else {
                        router.push('/');
                    }
                } else {
                    error.value = 'Erro ao salvar credenciais';
                }
            } catch (err) {
                error.value =
                    err.response?.data?.message || 'Credenciais inválidas';
            } finally {
                loading.value = false;
            }
        };

        const handleRegister = async () => {
            try {
                registerLoading.value = true;
                error.value = '';
                success.value = '';

                await authService.register(registerForm.value);

                success.value =
                    'Conta criada com sucesso! Faça login para continuar.';
                showRegister.value = false;
                registerForm.value = { email: '', password: '' };
            } catch (err) {
                error.value =
                    err.response?.data?.message || 'Erro ao criar conta';
            } finally {
                registerLoading.value = false;
            }
        };

        return {
            form,
            registerForm,
            loading,
            registerLoading,
            error,
            success,
            showRegister,
            handleLogin,
            handleRegister,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem 20px;
}

.login-card {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-header i {
    font-size: 3rem;
    color: #2c5aa0;
    margin-bottom: 1rem;
}

.login-header h1 {
    color: #2c5aa0;
    margin-bottom: 0.5rem;
    font-size: 2rem;
}

.login-header p {
    color: #666;
    font-size: 1rem;
}

.login-form {
    margin-bottom: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #2c5aa0;
}

.form-group input:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
}

.btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: #2c5aa0;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #1e3a8a;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background: #4b5563;
}

.error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.success-message {
    background: #d1fae5;
    color: #059669;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.login-footer {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid #e1e5e9;
}

.link-btn {
    background: none;
    border: none;
    color: #2c5aa0;
    text-decoration: underline;
    cursor: pointer;
    font-size: 1rem;
}

.link-btn:hover {
    color: #1e3a8a;
}

.register-form {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e1e5e9;
}

.register-form h2 {
    color: #2c5aa0;
    margin-bottom: 1.5rem;
    text-align: center;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .login-card {
        padding: 2rem;
    }

    .login-header h1 {
        font-size: 1.5rem;
    }

    .login-header i {
        font-size: 2rem;
    }
}
</style>
