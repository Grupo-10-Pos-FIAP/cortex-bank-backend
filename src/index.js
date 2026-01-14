const Express = require('express')
const publicRoutes = require('./publicRoutes')
const routes = require('./routes')
const connectDB = require('./infra/mongoose/mongooseConect');
const app = new Express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocs =  require('./swagger')
const UserController = require('./controller/User')
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(Express.json())
app.use(cookieParser())

// Configuração do CORS para suportar cookies em microfrontends
const corsOptions = {
    credentials: true, // Permite cookies em requisições cross-origin
    origin: function (origin, callback) {
        // Em desenvolvimento, permite todas as origens
        // Em produção, use a variável CORS_ORIGIN com múltiplas origens separadas por vírgula
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true)
        }
        
        // Requisições sem origin (mesmo domínio, Postman, etc) são permitidas
        if (!origin) {
            return callback(null, true)
        }
        
        const allowedOrigins = process.env.CORS_ORIGIN 
            ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(o => o.length > 0)
            : []
        
        // Verifica se a origem está na lista permitida
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            // Log para debug
            console.log('CORS blocked:', {
                origin: origin,
                allowedOrigins: allowedOrigins,
                corsOriginEnv: process.env.CORS_ORIGIN
            })
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type']
}

app.use(cors(corsOptions))

app.use(publicRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res, next) => {
    if (req.url.includes('/docs')) {
        return next();
    }
    // Tenta obter o token do header Authorization ou do cookie
    const [_, token] = req.headers['authorization']?.split(' ') || []
    const cookieToken = req.cookies?.token
    const tokenToVerify = token || cookieToken
    
    const user = UserController.getToken(tokenToVerify)
    if (!user) return res.status(401).json({ message: 'Token inválido' })
    req.user = user
    next()
})
app.use(routes)

const serverPromise = connectDB().then(() => {
    if (process.env.NODE_ENV !== 'test') {
        app.listen(process.env.port || 3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    }
});


module.exports = app
module.exports.ready = serverPromise
