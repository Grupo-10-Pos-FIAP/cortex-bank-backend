# Cortex Bank - Backend API

## Sobre o Projeto

Este projeto é uma API REST desenvolvida em Node.js para gerenciamento financeiro (Cortex Bank). 

**Origem do Projeto:**
- O backend inicial foi disponibilizado como parte da pós-graduação em Engenharia de Software Front End
- A partir da base original, o projeto foi adaptado e melhorado para atender às necessidades específicas do cenário de produção

**Melhorias Implementadas:**
- Configuração de CORS para produção com suporte a múltiplas origens
- Gerenciamento seguro de variáveis de ambiente (sem uso de arquivos `.env` em produção)
- Integração com MongoDB para persistência de dados
- Sistema de autenticação com JWT
- Documentação Swagger para facilitar o uso da API
- Testes automatizados
- Containerização com Docker

## Ambiente de Produção

A aplicação está atualmente hospedada em produção utilizando:
- **Coolify**: Plataforma de deploy e gerenciamento de containers
- **Hostinger**: Provedor de hospedagem
- **MongoDB Cloud (Atlas)**: Banco de dados hospedado na nuvem do MongoDB

**Segurança:**
- ⚠️ **IMPORTANTE**: Em produção, as configurações sensíveis são gerenciadas através de **variáveis de ambiente** configuradas diretamente na plataforma Coolify
- **NÃO** utilize arquivos `.env` em produção - todas as credenciais e configurações devem ser definidas como variáveis de ambiente na plataforma de hospedagem
- Isso garante maior segurança e evita exposição acidental de credenciais no repositório
- O banco de dados MongoDB está hospedado no **MongoDB Cloud (Atlas)**, garantindo alta disponibilidade, backups automáticos e escalabilidade

## Variáveis de Ambiente

A aplicação utiliza as seguintes variáveis de ambiente:

| Variável | Descrição | Obrigatória | Exemplo |
|----------|-----------|-------------|---------|
| `MONGO_URI` | URI de conexão com o MongoDB. Em produção, aponta para o MongoDB Cloud (Atlas) | Sim (exceto em testes) | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Ambiente de execução | Não | `development`, `production`, `test` |
| `CORS_ORIGIN` | Origens permitidas para CORS (separadas por vírgula) | Não (em produção) | `https://app1.com,https://app2.com` |
| `port` | Porta do servidor | Não (padrão: 3000) | `3000` |

**Configuração em Desenvolvimento:**
Para desenvolvimento local, você pode criar um arquivo `.env` na raiz do projeto (este arquivo está no `.gitignore` e não será commitado):

```env
MONGO_URI=mongodb://localhost:27017/cortex-bank
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
port=3000
```

**Configuração em Produção:**
Configure todas as variáveis diretamente na plataforma Coolify através da interface de gerenciamento de variáveis de ambiente.

**Banco de Dados em Produção:**
- O banco de dados utilizado em produção está hospedado no **MongoDB Cloud (Atlas)**
- A variável `MONGO_URI` em produção deve conter a connection string do MongoDB Atlas (formato: `mongodb+srv://...`)
- A conexão é gerenciada automaticamente pelo MongoDB Atlas, oferecendo alta disponibilidade e escalabilidade

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 22 ou superior)
- MongoDB (local ou remoto)

### Instalação Local

```bash
# Instalar dependências
npm install
# ou
pnpm install
```

### Executando o Projeto

#### Modo Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado na porta 3000 (ou na porta definida pela variável `port`).

#### Modo Produção

```bash
npm start
```

### Executando com Docker

#### Construir a imagem

```bash
docker build -t cortex-bank-backend .
```

#### Executar o container

```bash
docker run -p 3000:3000 \
  -e MONGO_URI=your_mongo_uri \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=https://yourdomain.com \
  cortex-bank-backend
```

#### Modo Desenvolvimento com Docker

```bash
docker build -f Dockerfile.dev -t cortex-bank-backend-dev .
docker run -p 3000:3000 \
  -v $(pwd):/usr/src/app \
  -e MONGO_URI=your_mongo_uri \
  cortex-bank-backend-dev
```

## Testes

Para executar os testes:

```bash
npm test
```

Os testes utilizam MongoDB em memória (MongoMemoryServer) e não requerem uma instância real do banco de dados.

## Documentação da API

### Swagger

A documentação interativa da API está disponível através do Swagger UI. Após iniciar o servidor, acesse:

```
http://localhost:3000/docs
```

No Swagger, você pode:
- Visualizar todas as rotas disponíveis
- Testar as requisições diretamente na interface
- Para rotas que necessitam autenticação, você pode colar o Bearer token no cadeado de autenticação

### Postman Collection

O projeto inclui uma collection do Postman para facilitar os testes da API:

- Arquivo: `tech-challenge-2.postman_collection.json`
- Para importar: Abra o Postman, clique em "Import", selecione o arquivo e importe a collection

![Import Postman](assets/image.png)
![Postman Collection](assets/image-1.png)

## Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Tokens). Todas as rotas protegidas requerem um token Bearer no header `Authorization`.

### Criando um Usuário

**Endpoint:** `POST /user`

**Request:**
```bash
curl --location 'http://localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Aluno Carequinha",
    "email": "teste@gmail.com",
    "password": "testes"
}'
```

**Response:**
```json
{
    "message": "usuário criado com sucesso",
    "result": {
        "username": "Aluno Carequinha",
        "email": "teste@gmail.com",
        "password": "testes",
        "id": "67607133f840bb97892eb657"
    }
}
```

### Autenticando (Obter Token)

**Endpoint:** `POST /user/auth`

**Request:**
```bash
curl --location 'http://localhost:3000/user/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "teste@gmail.com",
    "password": "testes"
}'
```

**Response:**
```json
{
    "message": "Usuário autenticado com sucesso",
    "result": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**⚠️ Importante:** Use este token no header `Authorization` como `Bearer {token}` para acessar as rotas protegidas.

## Conta

### Buscar Conta

**Endpoint:** `GET /account`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```bash
curl --location 'http://localhost:3000/account' \
--header 'Authorization: Bearer {seu_token_aqui}'
```

**Response:**
```json
{
    "message": "Conta encontrada carregado com sucesso",
    "result": {
        "account": [
            {
                "id": "67607133f840bb97892eb659",
                "type": "Debit",
                "userId": "67607133f840bb97892eb657"
            }
        ],
        "transactions": [
            {
                "id": "67607174f840bb97892eb669",
                "accountId": "67607133f840bb97892eb659",
                "type": "Debit",
                "value": -200,
                "date": "2024-12-16T18:29:08.734Z"
            },
            {
                "id": "67607174f840bb97892eb669",
                "accountId": "67607133f840bb97892eb659",
                "type": "Credit",
                "value": 200,
                "from": "text",
                "to": "text",
                "anexo": "text",
                "date": "2024-12-16T18:29:08.734Z"
            }
        ],
        "cards": [
            {
                "id": "67607133f840bb97892eb65b",
                "accountId": "67607133f840bb97892eb659",
                "type": "Debit",
                "is_blocked": false,
                "number": "13748712374891010",
                "dueDate": "2027-01-07T00:00:00.000Z",
                "functions": "Debit",
                "cvc": "505",
                "paymentDate": null,
                "name": "Carequinha"
            }
        ]
    }
}
```

### Criar Transação

**Endpoint:** `POST /account/transaction`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "accountId": "67607133f840bb97892eb659",
    "type": "Credit",  // "Credit" ou "Debit"
    "value": 200,
    "from": "text",    // String (opcional)
    "to": "text",      // String (opcional)
    "anexo": "text"    // String (opcional)
}
```

**Request:**
```bash
curl --location 'http://localhost:3000/account/transaction' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {seu_token_aqui}' \
--data '{
    "accountId": "67607133f840bb97892eb659",
    "value": 200,
    "type": "Debit"
}'
```

**Response:**
```json
{
    "id": "67607174f840bb97892eb669",
    "accountId": "67607133f840bb97892eb659",
    "type": "Debit",
    "value": -200,
    "date": "2024-12-16T18:29:08.734Z"
}
```

### Buscar Extrato

**Endpoint:** `GET /account/:accountId/statement`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```bash
curl --location 'http://localhost:3000/account/67607133f840bb97892eb659/statement' \
--header 'Authorization: Bearer {seu_token_aqui}'
```

**Response:**
```json
{
    "message": "Transação criada com sucesso",
    "result": {
        "transactions": [
            {
                "id": "67607171f840bb97892eb665",
                "accountId": "67607133f840bb97892eb659",
                "type": "Credit",
                "value": 200,
                "date": "2024-12-16T18:29:05.170Z"
            },
            {
                "id": "67607172f840bb97892eb667",
                "accountId": "67607133f840bb97892eb659",
                "type": "Debit",
                "value": -200,
                "date": "2024-12-16T18:29:06.250Z"
            }
        ]
    }
}
```

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── controller/          # Controladores da aplicação
│   ├── feature/             # Lógica de negócio por feature
│   │   ├── Account/
│   │   ├── Card/
│   │   ├── Transaction/
│   │   └── User/
│   ├── infra/               # Infraestrutura
│   │   └── mongoose/        # Configuração e repositórios MongoDB
│   ├── models/              # Modelos de dados
│   ├── index.js            # Ponto de entrada da aplicação
│   ├── publicRoutes.js     # Rotas públicas
│   ├── routes.js           # Rotas protegidas
│   └── swagger.js          # Configuração Swagger
├── tests/                  # Testes automatizados
├── Dockerfile              # Docker para produção
├── Dockerfile.dev          # Docker para desenvolvimento
└── package.json            # Dependências do projeto
```

## Segurança

- ✅ Autenticação JWT para rotas protegidas
- ✅ CORS configurado para produção com origens específicas
- ✅ Variáveis de ambiente para configurações sensíveis
- ✅ Container Docker com usuário não-root
- ✅ Validação de tokens em todas as rotas protegidas

## Licença

Este projeto foi desenvolvido como parte do trabalho de pós-graduação em Engenharia de Software Frontend.

## Autores

- [Gabrielle Martins](https://github.com/Gabrielle-96)
- [Helen Cris](https://github.com/HelenCrisM)
