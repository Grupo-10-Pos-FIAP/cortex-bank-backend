# Docker - Guia de Uso

Este projeto possui dois Dockerfiles diferentes: um para **produção** e outro para **desenvolvimento local**.

## 📦 Dockerfiles

### `DockerFile` (Produção)
- Instala apenas dependências de produção (`npm ci --only=production`)
- Executa como usuário não-root (mais seguro)
- Usa `npm start` (modo produção)
- Otimizado para deploy no Coolify

### `Dockerfile.dev` (Desenvolvimento Local)
- Instala todas as dependências (incluindo devDependencies)
- Executa como root (facilita debug)
- Usa `npm run dev` (nodemon com hot-reload)
- Ideal para desenvolvimento local

## 🚀 Executando Localmente

### Opção 1: Docker Compose (Recomendado)

```bash
# Subir a aplicação em modo desenvolvimento
docker-compose up

# Ou em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

O `docker-compose.yml` já está configurado para:
- Usar `Dockerfile.dev`
- Montar volumes para hot-reload
- Configurar variáveis de ambiente

### Opção 2: Docker Direto

```bash
# Build da imagem de desenvolvimento
docker build -f Dockerfile.dev -t cortex-bank-backend:dev .

# Executar container
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  -e MONGO_URI=mongodb://localhost:27017/cortex-bank \
  -v $(pwd)/src:/usr/src/app/src \
  cortex-bank-backend:dev
```

## 🏭 Executando em Produção

### Build da Imagem de Produção

```bash
docker build -f DockerFile -t cortex-bank-backend:prod .

# Executar container de produção
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGO_URI=mongodb://usuario:senha@host:porta/database \
  -e CORS_ORIGIN=https://seu-dominio.com \
  cortex-bank-backend:prod
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (não será commitado):

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/cortex-bank
CORS_ORIGIN=http://localhost:3000
```

O `docker-compose.yml` carrega automaticamente o arquivo `.env`.

## 📝 Notas

- **Desenvolvimento**: Use `Dockerfile.dev` ou `docker-compose.yml`
- **Produção**: Use `DockerFile` (será usado automaticamente pelo Coolify)
- O hot-reload funciona apenas com `Dockerfile.dev` e volumes montados
- Em produção, o código é copiado para dentro da imagem (sem volumes)
