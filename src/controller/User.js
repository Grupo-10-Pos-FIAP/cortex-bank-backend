const userDTO = require('../models/User')
const accountDTO = require('../models/Account')
const cardDTO = require('../models/Card')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'tech-challenge'

class UserController {
  constructor(di = {}) {
    this.di = Object.assign({
      userRepository: require('../infra/mongoose/repository/userRepository'),
      accountRepository: require('../infra/mongoose/repository/accountRepository'),
      cardRepository: require('../infra/mongoose/repository/cardRepository'),

      saveCard: require('../feature/Card/saveCard'),
      salvarUsuario: require('../feature/User/salvarUsuario'),
      saveAccount: require('../feature/Account/saveAccount'),
      getUser: require('../feature/User/getUser'),
    }, di)
  }

  async create(req, res) {
    const user = new userDTO(req.body)
    const { userRepository, accountRepository, cardRepository, salvarUsuario, saveAccount, saveCard } = this.di

    if (!user.username || !user.email || !user.password) {
      return res.status(400).json({ message: 'Dados inválidos: username, email e/ou password são obrigatórios' })
    }

    if (!user.isPasswordStrong(user.password)) {
      return res.status(400).json({ 
        message: 'A senha deve ter pelo menos 8 caracteres, contendo pelo menos uma letra, um número e um caractere especial' 
      })
    }
    try {
      const userCreated = await salvarUsuario({
        user, repository: userRepository
      })

      const accountCreated = await saveAccount({ account: new accountDTO({ userId: userCreated.id, type: 'Debit' }), repository: accountRepository })

      const firstCard = new cardDTO({ 
        type: 'GOLD',
        number: 13748712374891010,
        dueDate: '2027-01-07',
        functions: 'Debit',
        cvc: '505',
        paymentDate: null,
        name: userCreated.username,
        accountId: accountCreated.id
      })

      await saveCard({ card: firstCard, repository: cardRepository })

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        result: userCreated,
      })
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      res.status(500).json({ message: 'Erro ao criar usuário' })
    }

  }
  async find(req, res) {
    const { userRepository, getUser } = this.di
    try {
      const users = await getUser({ repository: userRepository })
      res.status(200).json({
        message: 'Usuários carregados com sucesso',
        result: users
      })
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      res.status(500).json({
        message: 'Erro ao buscar usuários'
      })
    }
  }
  async auth(req, res) {
    const { userRepository, getUser } = this.di
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }
    
    try {
      const user = await getUser({ repository: userRepository, userFilter: { email, password } })
      
      if (!user?.[0]) {
        return res.status(401).json({ message: 'Credenciais inválidas' })
      }
      
      const userToTokenize = { ...user[0], id: user[0].id.toString() }
      const token = jwt.sign(userToTokenize, JWT_SECRET, { expiresIn: '12h' })
    
      const isProduction = process.env.NODE_ENV === 'production'
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 12 * 60 * 60 * 1000, // 12 horas em milissegundos
        path: '/'
      })
      
      res.status(200).json({
        message: 'Usuário autenticado com sucesso',
        result: {
          token
        }
      })
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error)
      res.status(500).json({ message: 'Erro ao autenticar usuário' })
    }
  }
  static getToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      return decoded
    } catch (error) {
      return null
    }
  }
}

module.exports = UserController