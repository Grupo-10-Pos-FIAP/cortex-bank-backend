const { Router } = require('express')
const UserController = require('./controller/User')

const userController = new UserController({})
const router = Router()

/**
 * Health check endpoint para monitoramento e deploy
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da aplicação
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Aplicação está funcionando
 */
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'cortex-bank-backend'
  });
})

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Busca usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       404:
 *         description: Nenhum usuário encontrado
 */
router.get('/user', userController.find.bind(userController))

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/user', userController.create.bind(userController))

/**
 * @swagger
 * /user/auth:
 *   post:
 *     summary: Autenticação de usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/user/auth', userController.auth.bind(userController))

module.exports = router