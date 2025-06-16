<template>
    <div id="app">
        <!-- Header -->
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <div class="logo">
                        <i class="fas fa-recycle"></i>
                        <h1>Coleta Maringá</h1>
                    </div>
                    <nav class="nav">
                        <router-link to="/" class="nav-link">
                            <i class="fas fa-home"></i> Home
                        </router-link>
                        <router-link
                            v-if="!isAuthenticated"
                            to="/login"
                            class="nav-link"
                        >
                            <i class="fas fa-sign-in-alt"></i> Login
                        </router-link>
                        <router-link
                            v-if="isAuthenticated && isAdmin"
                            to="/dashboard"
                            class="nav-link"
                        >
                            <i class="fas fa-tachometer-alt"></i> Dashboard
                        </router-link>
                        <button
                            v-if="isAuthenticated"
                            @click="logout"
                            class="nav-link logout-btn"
                        >
                            <i class="fas fa-sign-out-alt"></i> Sair
                        </button>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main">
            <router-view />
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <p>
                    &copy; 2024 Sistema de Coleta de Lixo - Maringá. Todos os
                    direitos reservados.
                </p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'App',
    setup() {
        const router = useRouter();
        const isAuthenticated = ref(false);
        const isAdmin = ref(false);

        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            isAuthenticated.value = !!token;

            if (user) {
                const userData = JSON.parse(user);
                isAdmin.value = userData.role === 'admin';
            }
        };

        const logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            isAuthenticated.value = false;
            isAdmin.value = false;
            router.push('/');
        };

        onMounted(() => {
            checkAuth();
        });

        return {
            isAuthenticated,
            isAdmin,
            logout,
        };
    },
};
</script>

<style scoped>
.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #2c5aa0;
}

.logo i {
    font-size: 2rem;
}

.logo h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

.nav {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #555;
    border-radius: 25px;
    transition: all 0.3s ease;
    font-weight: 500;
}

.nav-link:hover {
    background: #f0f0f0;
    color: #2c5aa0;
    transform: translateY(-2px);
}

.nav-link.router-link-active {
    background: #2c5aa0;
    color: white;
}

.logout-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.logout-btn:hover {
    background: #dc3545;
    color: white;
}

.main {
    min-height: calc(100vh - 140px);
    padding: 2rem 0;
}

.footer {
    background: rgba(0, 0, 0, 0.1);
    text-align: center;
    padding: 1rem 0;
    color: white;
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
    }

    .nav {
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>
