<template>
    <div class="home">
        <div class="container">
            <section class="hero">
                <div class="hero-content">
                    <h1 class="hero-title">
                        <i class="fas fa-recycle"></i>
                        Consulte o Cronograma de Coleta de Lixo
                    </h1>
                    <p class="hero-subtitle">
                        Encontre os dias e horários da coleta de lixo em seu
                        bairro em Maringá
                    </p>
                </div>
            </section>

            <section class="filters">
                <div class="filters-card">
                    <h2><i class="fas fa-filter"></i> Filtros de Busca</h2>
                    <div class="filters-grid">
                        <div class="filter-group">
                            <label for="bairro">Bairro:</label>
                            <select
                                id="bairro"
                                v-model="filters.bairro"
                                @change="applyFilters"
                            >
                                <option value="">Todos os bairros</option>
                                <option
                                    v-for="bairro in bairros"
                                    :key="bairro"
                                    :value="bairro"
                                >
                                    {{ bairro }}
                                </option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label for="diaSemana">Dia da Semana:</label>
                            <select
                                id="diaSemana"
                                v-model="filters.diaSemana"
                                @change="applyFilters"
                            >
                                <option value="">Todos os dias</option>
                                <option value="segunda">Segunda-feira</option>
                                <option value="terca">Terça-feira</option>
                                <option value="quarta">Quarta-feira</option>
                                <option value="quinta">Quinta-feira</option>
                                <option value="sexta">Sexta-feira</option>
                                <option value="sabado">Sábado</option>
                                <option value="domingo">Domingo</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label for="tipoColeta">Tipo de Coleta:</label>
                            <select
                                id="tipoColeta"
                                v-model="filters.tipoColeta"
                                @change="applyFilters"
                            >
                                <option value="">Todos os tipos</option>
                                <option value="convencional">
                                    Convencional
                                </option>
                                <option value="seletiva">Seletiva</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <button
                                @click="clearFilters"
                                class="btn btn-secondary"
                            >
                                <i class="fas fa-times"></i> Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="results">
                <div class="results-header">
                    <h2>
                        <i class="fas fa-calendar-alt"></i>
                        Cronograma de Coleta
                        <span v-if="loading" class="loading">
                            <i class="fas fa-spinner fa-spin"></i>
                        </span>
                    </h2>
                    <p class="results-count">
                        {{ coletas.length }}
                        {{
                            coletas.length === 1
                                ? 'resultado encontrado'
                                : 'resultados encontrados'
                        }}
                    </p>
                </div>

                <div v-if="error" class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    {{ error }}
                </div>

                <div class="coletas-grid">
                    <div
                        v-for="coleta in coletas"
                        :key="coleta.id"
                        class="coleta-card"
                    >
                        <div class="coleta-header">
                            <h3>
                                <i class="fas fa-map-marker-alt"></i>
                                {{ coleta.bairro }}
                            </h3>
                            <span
                                class="coleta-type"
                                :class="coleta.tipoColeta"
                            >
                                {{
                                    coleta.tipoColeta === 'convencional'
                                        ? 'Convencional'
                                        : 'Seletiva'
                                }}
                            </span>
                        </div>

                        <div class="coleta-info">
                            <div class="info-item">
                                <i class="fas fa-calendar"></i>
                                <span>{{
                                    formatDiaSemana(coleta.diaSemana)
                                }}</span>
                            </div>

                            <div class="info-item">
                                <i class="fas fa-clock"></i>
                                <span>{{ coleta.horario }}</span>
                            </div>
                        </div>

                        <div
                            v-if="coleta.tiposResiduos"
                            class="coleta-residuos"
                        >
                            <strong>Tipos de Resíduos:</strong>
                            <p>{{ coleta.tiposResiduos }}</p>
                        </div>

                        <div
                            v-if="coleta.observacoes"
                            class="coleta-observacoes"
                        >
                            <strong>Observações:</strong>
                            <p>{{ coleta.observacoes }}</p>
                        </div>

                        <button
                            @click="viewDetails(coleta)"
                            class="btn btn-primary"
                        >
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                    </div>
                </div>

                <div v-if="!loading && coletas.length === 0" class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente ajustar os filtros de busca</p>
                </div>
            </section>

            <div
                v-if="selectedColeta"
                class="modal-overlay"
                @click="closeModal"
            >
                <div class="modal" @click.stop>
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-info-circle"></i>
                            Detalhes da Coleta
                        </h3>
                        <button @click="closeModal" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="modal-content">
                        <div class="detail-group">
                            <strong>Bairro:</strong>
                            <span>{{ selectedColeta.bairro }}</span>
                        </div>

                        <div class="detail-group">
                            <strong>Dia da Semana:</strong>
                            <span>{{
                                formatDiaSemana(selectedColeta.diaSemana)
                            }}</span>
                        </div>

                        <div class="detail-group">
                            <strong>Tipo de Coleta:</strong>
                            <span
                                class="type-badge"
                                :class="selectedColeta.tipoColeta"
                            >
                                {{
                                    selectedColeta.tipoColeta === 'convencional'
                                        ? 'Convencional'
                                        : 'Seletiva'
                                }}
                            </span>
                        </div>

                        <div class="detail-group">
                            <strong>Horário:</strong>
                            <span>{{ selectedColeta.horario }}</span>
                        </div>

                        <div
                            v-if="selectedColeta.tiposResiduos"
                            class="detail-group"
                        >
                            <strong>Tipos de Resíduos:</strong>
                            <p>{{ selectedColeta.tiposResiduos }}</p>
                        </div>

                        <div
                            v-if="selectedColeta.observacoes"
                            class="detail-group"
                        >
                            <strong>Observações:</strong>
                            <p>{{ selectedColeta.observacoes }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { coletaService } from '../services/api';

export default {
    name: 'Home',
    setup() {
        const coletas = ref([]);
        const bairros = ref([]);
        const loading = ref(false);
        const error = ref('');
        const selectedColeta = ref(null);

        const filters = ref({
            bairro: '',
            diaSemana: '',
            tipoColeta: '',
        });

        const loadColetas = async () => {
            try {
                loading.value = true;
                error.value = '';
                const data = await coletaService.getAllColetas(filters.value);
                coletas.value = data;
            } catch (err) {
                error.value = 'Erro ao carregar dados de coleta';
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        const loadBairros = async () => {
            try {
                const data = await coletaService.getBairros();
                bairros.value = data;
            } catch (err) {
                console.error('Erro ao carregar bairros:', err);
            }
        };

        const applyFilters = () => {
            loadColetas();
        };

        const clearFilters = () => {
            filters.value = {
                bairro: '',
                diaSemana: '',
                tipoColeta: '',
            };
            loadColetas();
        };

        const formatDiaSemana = (dia) => {
            const dias = {
                segunda: 'Segunda-feira',
                terca: 'Terça-feira',
                quarta: 'Quarta-feira',
                quinta: 'Quinta-feira',
                sexta: 'Sexta-feira',
                sabado: 'Sábado',
                domingo: 'Domingo',
            };
            return dias[dia] || dia;
        };

        const viewDetails = (coleta) => {
            selectedColeta.value = coleta;
        };

        const closeModal = () => {
            selectedColeta.value = null;
        };

        onMounted(() => {
            loadColetas();
            loadBairros();
        });

        return {
            coletas,
            bairros,
            loading,
            error,
            filters,
            selectedColeta,
            applyFilters,
            clearFilters,
            formatDiaSemana,
            viewDetails,
            closeModal,
        };
    },
};
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero {
    text-align: center;
    padding: 3rem 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    margin-bottom: 3rem;
    backdrop-filter: blur(10px);
}

.hero-title {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-title i {
    color: #4ade80;
    margin-right: 1rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.filters {
    margin-bottom: 3rem;
}

.filters-card {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.filters-card h2 {
    color: #2c5aa0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    align-items: end;
}

.filter-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.filter-group select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.filter-group select:focus {
    outline: none;
    border-color: #2c5aa0;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #2c5aa0;
    color: white;
}

.btn-primary:hover {
    background: #1e3a8a;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6b7280;
    color: white;
}

.btn-secondary:hover {
    background: #4b5563;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.results-header h2 {
    color: white;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.results-count {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
}

.loading {
    color: #4ade80;
}

.error-message {
    background: #fee2e2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.coletas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.coleta-card {
    background: white;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coleta-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.coleta-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.coleta-header h3 {
    color: #2c5aa0;
    font-size: 1.2rem;
}

.coleta-type {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.coleta-type.convencional {
    background: #ddd6fe;
    color: #7c3aed;
}

.coleta-type.seletiva {
    background: #d1fae5;
    color: #059669;
}

.coleta-info {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-size: 0.9rem;
}

.info-item i {
    color: #2c5aa0;
}

.coleta-residuos,
.coleta-observacoes {
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.coleta-residuos strong,
.coleta-observacoes strong {
    color: #333;
}

.coleta-residuos p,
.coleta-observacoes p {
    margin-top: 0.25rem;
    color: #666;
}

.no-results {
    text-align: center;
    padding: 3rem;
    color: white;
}

.no-results i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.no-results h3 {
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal {
    background: white;
    border-radius: 15px;
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    color: #2c5aa0;
    font-size: 1.3rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: #f3f4f6;
    color: #374151;
}

.modal-content {
    padding: 1.5rem;
}

.detail-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.detail-group strong {
    color: #333;
    font-size: 0.9rem;
}

.detail-group span,
.detail-group p {
    color: #666;
}

.type-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    display: inline-block;
}

.type-badge.convencional {
    background: #ddd6fe;
    color: #7c3aed;
}

.type-badge.seletiva {
    background: #d1fae5;
    color: #059669;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }

    .filters-grid {
        grid-template-columns: 1fr;
    }

    .coletas-grid {
        grid-template-columns: 1fr;
    }

    .results-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
