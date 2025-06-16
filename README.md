# 🗑️ Sistema de Coleta de Lixo - Maringá API

API RESTful desenvolvida com NestJS para consulta e gerenciamento do cronograma de coleta de lixo em Maringá.

## 🚀 Tecnologias Utilizadas

-   **NestJS** - Framework Node.js
-   **TypeORM** - ORM para TypeScript
-   **SQLite** - Banco de dados
-   **JWT** - Autenticação
-   **bcryptjs** - Hash de senhas
-   **class-validator** - Validação de dados

## 📋 Funcionalidades

### Para Usuários

-   ✅ Consultar cronograma completo de coleta
-   ✅ Filtrar por bairro
-   ✅ Filtrar por tipo de coleta (convencional/seletiva)
-   ✅ Filtrar por dia da semana
-   ✅ Visualizar detalhes da coleta
-   ✅ Listar bairros disponíveis

### Para Administradores

-   ✅ Inserir novos registros de coleta
-   ✅ Atualizar registros existentes
-   ✅ Remover registros de coleta
-   ✅ Gerenciar usuários

## 🔧 Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run start:dev

# Executar em modo produção
npm run build
npm start
```

## 📚 Endpoints da API

### 🔐 Autenticação

#### POST /auth/login

Realiza login do usuário

```json
{
    "email": "admin@maringa.com",
    "password": "admin123"
}
```

#### POST /auth/register

Registra novo usuário

```json
{
    "email": "usuario@exemplo.com",
    "password": "minhasenha123",
    "role": "user"
}
```

#### POST /auth/register-admin

Registra novo administrador (requer autenticação de admin)

```json
{
    "email": "admin@exemplo.com",
    "password": "senhaadmin123"
}
```

### 🗑️ Coleta de Lixo

#### GET /coleta

Lista todas as coletas ou filtra por parâmetros

**Parâmetros de consulta opcionais:**

-   `bairro`: Nome do bairro (busca parcial)
-   `diaSemana`: Dia da semana (segunda, terca, quarta, quinta, sexta, sabado, domingo)
-   `tipoColeta`: Tipo de coleta (convencional, seletiva)

**Exemplos:**

```
GET /coleta - Lista todas as coletas
GET /coleta?bairro=Centro - Filtra por bairro
GET /coleta?tipoColeta=seletiva - Filtra por tipo de coleta
GET /coleta?diaSemana=segunda&bairro=Centro - Múltiplos filtros
```

#### GET /coleta/bairros

Lista todos os bairros disponíveis

#### GET /coleta/:id

Obtém detalhes de uma coleta específica

#### POST /coleta

Cria nova coleta (requer autenticação de admin)

```json
{
    "bairro": "Centro",
    "diaSemana": "segunda",
    "tipoColeta": "convencional",
    "horario": "07:00",
    "observacoes": "Coleta nas ruas principais",
    "tiposResiduos": "Lixo doméstico geral, restos de alimentos"
}
```

#### PATCH /coleta/:id

Atualiza coleta existente (requer autenticação de admin)

```json
{
    "horario": "08:00",
    "observacoes": "Horário alterado"
}
```

#### DELETE /coleta/:id

Remove coleta (requer autenticação de admin)

## 🔑 Autenticação

Para endpoints protegidos, incluir o token JWT no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 👥 Usuários Padrão

### Administrador

-   **Email:** admin@maringa.com
-   **Senha:** admin123

## 📊 Dados de Exemplo

A API vem com dados pré-populados incluindo:

-   Usuário administrador
-   Cronograma de coleta para diversos bairros:
    -   Centro
    -   Jardim Alvorada
    -   Vila Esperança
    -   Conjunto Habitacional Inocente Vila Nova
    -   Sarandi

## 🏗️ Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação
├── user/           # Módulo de usuários
├── coleta/         # Módulo de coleta
├── common/         # Recursos compartilhados
│   └── seeds/      # Dados iniciais
├── app.module.ts   # Módulo principal
└── main.ts         # Ponto de entrada
```

## 🎯 Casos de Uso Implementados

### Consultar Cronograma de Coleta

-   Endpoint: `GET /coleta`
-   Permite visualizar todo o cronograma de coleta
-   Suporte a filtros por bairro, tipo e dia

### Filtrar por Bairro

-   Endpoint: `GET /coleta?bairro=<nome>`
-   Busca parcial por nome do bairro
-   Retorna todas as coletas do bairro especificado

### Visualizar Detalhes da Coleta

-   Endpoint: `GET /coleta/:id`
-   Mostra informações detalhadas sobre uma coleta específica
-   Inclui tipos de resíduos e observações

### Inserir Dados da Coleta (Admin)

-   Endpoint: `POST /coleta`
-   Permite administradores adicionarem novos registros
-   Validação completa dos dados

### Atualizar Dados da Coleta (Admin)

-   Endpoint: `PATCH /coleta/:id`
-   Permite administradores modificarem registros existentes
-   Atualização parcial suportada

## 🛡️ Segurança

-   Autenticação JWT
-   Hash de senhas com bcrypt
-   Validação de dados de entrada
-   Controle de acesso baseado em roles
-   Proteção de rotas administrativas

## 📱 Frontend Sugerido

Esta API pode ser consumida por:

-   Aplicações web (React, Vue.js, Angular)
-   Aplicações mobile (React Native, Flutter)
-   Aplicações desktop (Electron)

## 🌐 CORS

CORS está habilitado para permitir requisições de qualquer origem durante o desenvolvimento.

## 📝 Logs

A aplicação gera logs detalhados incluindo:

-   Queries do banco de dados
-   Operações de seed
-   Autenticações
-   Erros e exceções

---

**Desenvolvido com ❤️ para facilitar a vida dos cidadãos de Maringá!** 🏙️
"# AEP-5s"  
"# AEP-5s"  
"# AEP-5s" 
