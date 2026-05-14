<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,100:4F46E5&height=120&section=header" />
</div>

<div align="center">
  <h1>Fintrack</h1>
  <p><strong>Sistema de finanças pessoais completo — controle suas receitas, despesas e metas mensais.</strong></p>

  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.14-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16.13-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</div>

---

## Sobre o projeto

O **Fintrack** é uma aplicação web full stack de finanças pessoais que permite ao usuário controlar suas receitas e despesas, organizar por categorias personalizadas, definir metas mensais de gastos e acompanhar sua evolução financeira através de gráficos e relatórios.

---

## Funcionalidades

- Autenticação completa com JWT (registro e login)
- Controle de receitas e despesas com categorias
- Categorias personalizadas com cor e ícone
- Metas mensais por categoria com barra de progresso
- Dashboard com gráficos de evolução e resumo financeiro
- Filtro de transações por mês, ano e tipo
- Relatórios com exportação em PDF
- Multi-usuário — cada usuário vê apenas seus próprios dados

---

## Telas

| Dashboard      | Transações      |
| -------------- | --------------- |
| ![Dashboard]() | ![Transações]() |

| Categorias      | Metas      |
| --------------- | ---------- |
| ![Categorias]() | ![Metas]() |

---

## Arquitetura

```
fintrack/
├── backend/          # API REST em Java com Spring Boot
│   ├── config/       # SecurityConfig, CorsConfig
│   ├── controller/   # Endpoints REST
│   ├── domain/
│   │   ├── entity/   # User, Category, Transaction, Goal
│   │   └── enums/    # TransactionType (INCOME/EXPENSE)
│   ├── dto/
│   │   ├── request/  # Payloads de entrada com validação
│   │   └── response/ # Payloads de saída
│   ├── exception/    # GlobalExceptionHandler, ResourceNotFoundException
│   ├── repository/   # Interfaces JPA com queries customizadas
│   ├── security/     # JwtFilter, JwtService, UserDetailsServiceImpl
│   └── service/      # Regras de negócio
│
└── frontend/         # Interface em Next.js com TypeScript
    └── src/
        ├── app/
        │   ├── (auth)/       # Login e Cadastro
        │   └── (dashboard)/  # Área autenticada
        ├── components/       # Componentes reutilizáveis
        ├── contexts/         # AuthContext
        ├── hooks/            # Hooks customizados
        ├── lib/              # Instância do Axios
        └── types/            # Interfaces TypeScript
```

---

## Stack tecnológica

### Back-End

| Tecnologia      | Versão | Uso                           |
| --------------- | ------ | ----------------------------- |
| Java            | 21     | Linguagem principal           |
| Spring Boot     | 3.5.14 | Framework principal           |
| Spring Security | 6      | Autenticação e autorização    |
| Spring Data JPA | 3.5.14 | Persistência de dados         |
| JWT (jjwt)      | 0.12.6 | Geração e validação de tokens |
| PostgreSQL      | 16.13  | Banco de dados relacional     |
| Lombok          | latest | Redução de boilerplate        |
| Maven           | 3.8.7  | Gerenciamento de dependências |

### Front-End

| Tecnologia      | Versão | Uso                            |
| --------------- | ------ | ------------------------------ |
| Next.js         | 16.2.6 | Framework React com App Router |
| TypeScript      | 5.9.3  | Tipagem estática               |
| Tailwind CSS    | 4.3.0  | Estilização                    |
| shadcn/ui       | 4.7.0  | Componentes de UI              |
| Recharts        | 3.8.1  | Gráficos e visualizações       |
| React Hook Form | 7.75.0 | Gerenciamento de formulários   |
| Zod             | 4.4.3  | Validação de schemas           |
| Axios           | 1.16.1 | Requisições HTTP               |

### Infra

| Tecnologia | Uso                        |
| ---------- | -------------------------- |
| Nginx      | Reverse proxy              |
| PM2        | Gerenciamento de processos |
| Certbot    | SSL/HTTPS                  |

---

## Modelo de dados

```
User
├── id (UUID)
├── name
├── email (unique)
├── password (bcrypt)
└── timestamps

Category
├── id (UUID)
├── name
├── color (hex)
├── icon (lucide)
├── user_id (FK)
└── createdAt

Transaction
├── id (UUID)
├── description
├── amount (BigDecimal)
├── type (INCOME | EXPENSE)
├── date (LocalDate)
├── category_id (FK)
├── user_id (FK)
└── timestamps

Goal
├── id (UUID)
├── name
├── limitAmount (BigDecimal)
├── month
├── year
├── category_id (FK)
├── user_id (FK)
└── timestamps
```

---

## Endpoints da API

### Auth

| Método | Rota                 | Descrição                |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Cadastro de usuário      |
| POST   | `/api/auth/login`    | Login e geração de token |

### Categories

| Método | Rota                   | Descrição                    |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/categories`      | Listar categorias do usuário |
| GET    | `/api/categories/{id}` | Buscar categoria por ID      |
| POST   | `/api/categories`      | Criar categoria              |
| PUT    | `/api/categories/{id}` | Atualizar categoria          |
| DELETE | `/api/categories/{id}` | Deletar categoria            |

### Transactions

| Método | Rota                                          | Descrição                  |
| ------ | --------------------------------------------- | -------------------------- |
| GET    | `/api/transactions`                           | Listar todas as transações |
| GET    | `/api/transactions/month?month=5&year=2026`   | Listar por mês             |
| GET    | `/api/transactions/summary?month=5&year=2026` | Resumo do mês              |
| GET    | `/api/transactions/{id}`                      | Buscar por ID              |
| POST   | `/api/transactions`                           | Criar transação            |
| PUT    | `/api/transactions/{id}`                      | Atualizar transação        |
| DELETE | `/api/transactions/{id}`                      | Deletar transação          |

### Goals

| Método | Rota                           | Descrição           |
| ------ | ------------------------------ | ------------------- |
| GET    | `/api/goals?month=5&year=2026` | Listar metas do mês |
| POST   | `/api/goals`                   | Criar meta          |
| PUT    | `/api/goals/{id}`              | Atualizar meta      |
| DELETE | `/api/goals/{id}`              | Deletar meta        |

---

## Como rodar o projeto

### Pré-requisitos

- Java 21+
- Node.js 18+
- PostgreSQL 16+
- Maven 3+
- pnpm

### 1. Clone o repositório

```bash
git clone https://github.com/gabrielportodev/fintrack.git
cd fintrack
```

### 2. Configure e rode o back-end

```bash
cd backend
```

Crie o banco de dados:

```bash
psql -U postgres -c "CREATE DATABASE fintrack_db;"
```

Configure o `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fintrack_db
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.jpa.hibernate.ddl-auto=update

jwt.secret=seu-secret-minimo-256-bits
jwt.expiration=86400000
```

Rode o projeto:

```bash
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### 3. Configure e rode o front-end

```bash
cd frontend
```

Crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Instale as dependências e rode:

```bash
pnpm install
pnpm dev
```

O front-end estará disponível em `http://localhost:3000`

---

## Deploy

O sistema está hospedado em VPS própria com:

- **Front-end:** `fintrack.gabrielporto.me`
- **Back-end:** `api-fintrack.gabrielporto.me`
- **SSL:** Certbot
- **Proxy:** Nginx
- **Processos:** PM2

---

## Autor

<div align="center">
  <img src="https://github.com/gabrielportodev.png" width="100px" style="border-radius: 50%" />
  <br/>
  <strong>Gabriel Porto</strong>
  <br/>
  Desenvolvedor Full Stack | Java & Spring Boot | Next.js & TypeScript

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/gabrielportodev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gabrielportodev)
[![Portfolio](https://img.shields.io/badge/Portfolio-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://gabrielporto.me)

</div>

---

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,100:4F46E5&height=120&section=footer" />
</div>
