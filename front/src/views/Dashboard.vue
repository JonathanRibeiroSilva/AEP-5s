<template>
    <div class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <h1>
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard Administrativo
                </h1>
                <p>Gerencie o cronograma de coleta de lixo</p>
            </div>

            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalColetas }}</h3>
                        <p>Total de Coletas</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ totalBairros }}</h3>
                        <p>Bairros Atendidos</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-recycle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ coletasSeletivas }}</h3>
                        <p>Coletas Seletivas</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-trash"></i>
                    </div>
                    <div class="stat-info">
                        <h3>{{ coletasConvencionais }}</h3>
                        <p>Coletas Convencionais</p>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="actions-section">
                <button @click="showCreateForm = true" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Nova Coleta
                </button>

                <button @click="loadColetas" class="btn btn-secondary">
                    <i class="fas fa-sync-alt"></i>
                    Atualizar Lista
                </button>
            </div>

            <!-- Coletas Table -->
            <div class="table-section">
                <div class="table-header">
                    <h2>
                        <i class="fas fa-list"></i>
                        Gerenciar Coletas
                    </h2>
                </div>

                <div v-if="loading" class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    Carregando...
                </div>

                <div v-if="error" class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    {{ error }}
                </div>

                <div class="table-responsive">
                    <table class="coletas-table">
                        <thead>
                            <tr>
                                <th>Bairro</th>
                                <th>Dia</th>
                                <th>Tipo</th>
                                <th>Horário</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="coleta in coletas" :key="coleta.id">
                                <td>{{ coleta.bairro }}</td>
                                <td>{{ formatDiaSemana(coleta.diaSemana) }}</td>
                                <td>
                                    <span
                                        class="type-badge"
                                        :class="coleta.tipoColeta"
                                    >
                                        {{
                                            coleta.tipoColeta === 'convencional'
                                                ? 'Convencional'
                                                : 'Seletiva'
                                        }}
                                    </span>
                                </td>
                                <td>{{ coleta.horario }}</td>
                                <td class="actions">
                                    <button
                                        @click="editColeta(coleta)"
                                        class="btn-icon btn-edit"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        @click="deleteColeta(coleta.id)"
                                        class="btn-icon btn-delete"
                                        :disabled="deleting"
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Create/Edit Modal -->
            <div
                v-if="showCreateForm || editingColeta"
                class="modal-overlay"
                @click="closeModal"
            >
                <div class="modal" @click.stop>
                    <div class="modal-header">
                        <h3>
                            <i class="fas fa-plus-circle"></i>
                            {{
                                editingColeta ? 'Editar Coleta' : 'Nova Coleta'
                            }}
                        </h3>
                        <button @click="closeModal" class="close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form @submit.prevent="saveColeta" class="modal-content">
                        <div class="form-group">
                            <label for="bairro">Bairro:</label>
                            <input
                                type="text"
                                id="bairro"
                                v-model="form.bairro"
                                required
                                placeholder="Digite o nome do bairro"
                            />
                        </div>

                        <div class="form-group">
                            <label for="diaSemana">Dia da Semana:</label>
                            <select
                                id="diaSemana"
                                v-model="form.diaSemana"
                                required
                            >
                                <option value="">Selecione o dia</option>
                                <option value="segunda">Segunda-feira</option>
                                <option value="terca">Terça-feira</option>
                                <option value="quarta">Quarta-feira</option>
                                <option value="quinta">Quinta-feira</option>
                                <option value="sexta">Sexta-feira</option>
                                <option value="sabado">Sábado</option>
                                <option value="domingo">Domingo</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="tipoColeta">Tipo de Coleta:</label>
                            <select
                                id="tipoColeta"
                                v-model="form.tipoColeta"
                                required
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="convencional">
                                    Convencional
                                </option>
                                <option value="seletiva">Seletiva</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="horario">Horário:</label>
                            <input
                                type="time"
                                id="horario"
                                v-model="form.horario"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="tiposResiduos"
                                >Tipos de Resíduos:</label
                            >
                            <textarea
                                id="tiposResiduos"
                                v-model="form.tiposResiduos"
                                placeholder="Descreva os tipos de resíduos coletados"
                                rows="3"
                            ></textarea>
                        </div>

                        <div class="form-group">
                            <label for="observacoes">Observações:</label>
                            <textarea
                                id="observacoes"
                                v-model="form.observacoes"
                                placeholder="Observações adicionais"
                                rows="3"
                            ></textarea>
                        </div>

                        <div class="modal-actions">
                            <button
                                type="button"
                                @click="closeModal"
                                class="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary"
                                :disabled="saving"
                            >
                                <span v-if="saving">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    Salvando...
                                </span>
                                <span v-else>
                                    <i class="fas fa-save"></i>
                                    Salvar
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { coletaService } from '../services/api';

export default {
    name: 'Dashboard',
    setup() {
        const coletas = ref([]);
        const loading = ref(false);
        const saving = ref(false);
        const deleting = ref(false);
        const error = ref('');
        const showCreateForm = ref(false);
        const editingColeta = ref(null);

        const form = ref({
            bairro: '',
            diaSemana: '',
            tipoColeta: '',
            horario: '',
            tiposResiduos: '',
            observacoes: '',
        });

        const totalColetas = computed(() => coletas.value.length);
        const totalBairros = computed(() => {
            const bairros = new Set(coletas.value.map((c) => c.bairro));
            return bairros.size;
        });
        const coletasSeletivas = computed(
            () =>
                coletas.value.filter((c) => c.tipoColeta === 'seletiva').length
        );
        const coletasConvencionais = computed(
            () =>
                coletas.value.filter((c) => c.tipoColeta === 'convencional')
                    .length
        );

        const loadColetas = async () => {
            try {
                loading.value = true;
                error.value = '';
                const data = await coletaService.getAllColetas();
                coletas.value = data;
            } catch (err) {
                error.value = 'Erro ao carregar coletas';
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        const formatDiaSemana = (dia) => {
            const dias = {
                segunda: 'Segunda',
                terca: 'Terça',
                quarta: 'Quarta',
                quinta: 'Quinta',
                sexta: 'Sexta',
                sabado: 'Sábado',
                domingo: 'Domingo',
            };
            return dias[dia] || dia;
        };

        const resetForm = () => {
            form.value = {
                bairro: '',
                diaSemana: '',
                tipoColeta: '',
                horario: '',
                tiposResiduos: '',
                observacoes: '',
            };
        };

        const closeModal = () => {
            showCreateForm.value = false;
            editingColeta.value = null;
            resetForm();
        };

        const editColeta = (coleta) => {
            editingColeta.value = coleta;
            form.value = { ...coleta };
        };

        const saveColeta = async () => {
            try {
                saving.value = true;
                error.value = '';

                if (editingColeta.value) {
                    await coletaService.updateColeta(
                        editingColeta.value.id,
                        form.value
                    );
                } else {
                    await coletaService.createColeta(form.value);
                }

                await loadColetas();
                closeModal();
            } catch (err) {
                error.value = 'Erro ao salvar coleta';
                console.error(err);
            } finally {
                saving.value = false;
            }
        };

        const deleteColeta = async (id) => {
            if (!confirm('Tem certeza que deseja excluir esta coleta?')) {
                return;
            }

            try {
                deleting.value = true;
                await coletaService.deleteColeta(id);
                await loadColetas();
            } catch (err) {
                error.value = 'Erro ao excluir coleta';
                console.error(err);
            } finally {
                deleting.value = false;
            }
        };

        onMounted(() => {
            loadColetas();
        });

        return {
            coletas,
            loading,
            saving,
            deleting,
            error,
            showCreateForm,
            editingColeta,
            form,
            totalColetas,
            totalBairros,
            coletasSeletivas,
            coletasConvencionais,
            loadColetas,
            formatDiaSemana,
            closeModal,
            editColeta,
            saveColeta,
            deleteColeta,
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

.dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
}

.dashboard-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.dashboard-header i {
    color: #4ade80;
    margin-right: 1rem;
}

.dashboard-header p {
    font-size: 1.2rem;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    background: #f0f9ff;
    padding: 1rem;
    border-radius: 10px;
    color: #2c5aa0;
    font-size: 1.5rem;
}

.stat-info h3 {
    font-size: 2rem;
    color: #2c5aa0;
    margin-bottom: 0.25rem;
}

.stat-info p {
    color: #666;
    font-size: 0.9rem;
}

.actions-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
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

.table-section {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.table-header h2 {
    color: #2c5aa0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.loading-spinner {
    text-align: center;
    padding: 2rem;
    color: #2c5aa0;
    font-size: 1.1rem;
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

.table-responsive {
    overflow-x: auto;
}

.coletas-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.coletas-table th {
    background: #f8f9fa;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #e5e7eb;
}

.coletas-table td {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.type-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.type-badge.convencional {
    background: #ddd6fe;
    color: #7c3aed;
}

.type-badge.seletiva {
    background: #d1fae5;
    color: #059669;
}

.actions {
    display: flex;
    gap: 0.5rem;
}

.btn-icon {
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-edit {
    background: #3b82f6;
    color: white;
}

.btn-edit:hover {
    background: #2563eb;
}

.btn-delete {
    background: #ef4444;
    color: white;
}

.btn-delete:hover:not(:disabled) {
    background: #dc2626;
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
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
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

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #2c5aa0;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .actions-section {
        flex-direction: column;
    }

    .modal-actions {
        flex-direction: column;
    }

    .actions {
        flex-direction: column;
    }
}
</style>
