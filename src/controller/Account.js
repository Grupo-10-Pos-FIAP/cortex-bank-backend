const DetailedAccountModel = require('../models/DetailedAccount')


class AccountController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),
      transactionRepository: require('../infra/mongoose/repository/detailedAccountRepository'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
      getAccount: require('../feature/Account/getAccount'),
      saveTransaction: require('../feature/Transaction/saveTransaction'),
      getTransaction: require('../feature/Transaction/getTransaction'),
      updateTransaction: require('../feature/Transaction/updateTransaction'),
      deleteTransaction: require('../feature/Transaction/deleteTransaction'),
      getCard: require('../feature/Card/getCard'),
    }, di)
  }

  async find(req, res) {
    const { accountRepository, getAccount, getCard, getTransaction, transactionRepository, cardRepository } = this.di

    try {
      const userId = req.user.id
      const account = await getAccount({ repository: accountRepository, filter: { userId } })
      
      if (!account || account.length === 0) {
        return res.status(404).json({ message: 'Conta não encontrada' })
      }

      const transactions = await getTransaction({ filter: { accountId: account[0].id }, repository: transactionRepository })
      const cards = await getCard({ filter: { accountId: account[0].id }, repository: cardRepository })
    
      res.status(200).json({
        message: 'Conta encontrada com sucesso',
        result: {
          account,
          transactions,
          cards,
        }
      })
    } catch (error) {
      console.error('Erro ao buscar conta:', error)
      res.status(500).json({
        message: 'Erro ao buscar conta'
      })
    }
  }

  async createTransaction(req, res) {
    const { saveTransaction, transactionRepository } = this.di
    const { accountId, value, type, from, to, anexo, status } = req.body
    const urlAnexo = req.body.urlAnexo ?? req.body.urlanexo ?? null
    
    if (!accountId || !value || !type) {
      return res.status(400).json({ message: 'accountId, value e type são obrigatórios' })
    }
    
    const transactionData = { accountId, value, from, to, anexo, urlAnexo, type, date: new Date() }
    if (status) {
      transactionData.status = status
    }
    
    try {
      const detailedAccount = new DetailedAccountModel(transactionData)
      const transaction = await saveTransaction({ transaction: detailedAccount, repository: transactionRepository })
      
      res.status(201).json({
        message: 'Transação criada com sucesso',
        result: transaction
      })
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      res.status(500).json({ message: 'Erro ao criar transação' })
    }
  }

  async updateTransaction(req, res) {
    const { updateTransaction, transactionRepository } = this.di
    const { id } = req.params
    const { value, type, from, to, anexo, status } = req.body
    const urlAnexo = req.body.urlAnexo ?? req.body.urlanexo

    const updates = {
      value,
      type,
      from,
      to,
      anexo,
      urlAnexo,
      status
    }

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key])

    try {
      const transaction = await updateTransaction({ transactionId: id, updates, repository: transactionRepository })

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada' })
      }

      res.status(200).json({
        message: 'Transação atualizada com sucesso',
        result: transaction
      })
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
      res.status(500).json({ message: 'Erro ao atualizar transação' })
    }
  }

  async deleteTransaction(req, res) {
    const { deleteTransaction, transactionRepository } = this.di
    const { id } = req.params

    try {
      const deleted = await deleteTransaction({ transactionId: id, repository: transactionRepository })

      if (!deleted) {
        return res.status(404).json({ message: 'Transação não encontrada' })
      }

      res.status(204).send()
    } catch (error) {
      console.error('Erro ao deletar transação:', error)
      res.status(500).json({ message: 'Erro ao deletar transação' })
    }
  }

  async getStatement(req, res) {
    const { getTransaction, transactionRepository } = this.di
    const { accountId } = req.params

    try {
      const transactions = await getTransaction({ filter: { accountId }, repository: transactionRepository })
      res.status(200).json({
        message: 'Extrato encontrado com sucesso',
        result: {
          transactions
        }
      })
    } catch (error) {
      console.error('Erro ao buscar extrato:', error)
      res.status(500).json({ message: 'Erro ao buscar extrato' })
    }
  }

  async getTransaction(req, res) {
    const { getTransaction, transactionRepository } = this.di
    const { id } = req.params
    
    try {
      const transactions = await getTransaction({ filter: { _id: id }, repository: transactionRepository })
      if (!transactions || transactions.length === 0) {
        return res.status(404).json({ message: 'Transação não encontrada' })
      }
      res.status(200).json({
        message: 'Transação encontrada com sucesso',
        result: transactions[0]
      })
    } catch (error) {
      console.error('Erro ao buscar transação:', error)
      res.status(500).json({ message: 'Erro ao buscar transação' })
    }
  }

  async completeTransaction(req, res) {
    const { updateTransaction, transactionRepository } = this.di
    const { id } = req.params

    try {
      const transaction = await updateTransaction({ 
        transactionId: id, 
        updates: { status: 'Done' }, 
        repository: transactionRepository 
      })

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada' })
      }

      res.status(200).json({
        message: 'Transação marcada como concluída com sucesso',
        result: transaction
      })
    } catch (error) {
      console.error('Erro ao marcar transação como concluída:', error)
      res.status(500).json({ message: 'Erro ao marcar transação como concluída' })
    }
  }
}

module.exports = AccountController
