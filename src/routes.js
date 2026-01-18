const { Router } = require('express')
const AccountController = require('./controller/Account')
const accountController = new AccountController({})
const router = Router()

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Busca contas
 *     tags: [Contas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contas encontradas
 */
router.get('/account', accountController.find.bind(accountController))

/**
 * @swagger
 * /account/transaction:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               value:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Debit, Credit]
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               anexo:
 *                 type: string
 *               urlAnexo:
 *                 type: string
 *                 description: URL do anexo armazenado
 *               status:
 *                 type: string
 *                 enum: [Pending, Done]
 *                 description: Status da transação (default: Pending)
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [Pending, Done]
 *                   description: Status da transação
 */
router.post('/account/transaction', accountController.createTransaction.bind(accountController))

/**
 * @swagger
 * /account/transaction/{id}:
 *   put:
 *     summary: Atualiza uma transação existente
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Debit, Credit]
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               anexo:
 *                 type: string
 *               urlAnexo:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, Done]
 *                 description: Status da transação
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *       404:
 *         description: Transação não encontrada
 */
router.put('/account/transaction/:id', accountController.updateTransaction.bind(accountController))

/**
 * @swagger
 * /account/transaction/{id}:
 *   delete:
 *     summary: Remove uma transação
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Transação removida com sucesso
 *       404:
 *         description: Transação não encontrada
 */
router.delete('/account/transaction/:id', accountController.deleteTransaction.bind(accountController))


/**
 * @swagger
 * /account/transaction/{id}:
 *   get:
 *     summary: Obtém transação por ID
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação encontrada com sucesso
 *       401:
 *         description: Token invalido ou transação não encontrada
 */
router.get('/account/transaction/:id', accountController.getTransaction.bind(accountController))

/**
 * @swagger
 * /account/transaction/{id}/complete:
 *   patch:
 *     summary: Marca uma transação como concluída
 *     tags: [Transações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da transação
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação marcada como concluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [Done]
 *       404:
 *         description: Transação não encontrada
 *       500:
 *         description: Erro ao marcar transação como concluída
 */
router.patch('/account/transaction/:id/complete', accountController.completeTransaction.bind(accountController))

/**
 * @swagger
 * /account/{accountId}/statement:
 *   get:
 *     summary: Obtém extrato da conta
 *     tags: [Extratos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         description: ID da conta
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Extrato encontrado
 *       401:
 *         description: Token invalido
 */
router.get('/account/:accountId/statement', accountController.getStatment.bind(accountController))

module.exports = router
