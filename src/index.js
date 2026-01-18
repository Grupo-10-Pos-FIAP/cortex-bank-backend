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

const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true)
        }
        
        if (!origin) {
            return callback(null, true)
        }
        
        const allowedOrigins = process.env.CORS_ORIGIN 
            ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(o => o.length > 0)
            : []
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

app.use(Express.json())
app.use(cookieParser())

app.use(publicRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((req, res, next) => {
    if (req.url.includes('/docs')) {
        return next();
    }
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
