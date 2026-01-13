FROM node:18-bullseye

WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE 3000

# Usar start para produção
CMD ["npm", "start"]
