const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod;

async function connectDB() {
  try {
    if (process.env.NODE_ENV === 'test') {
      mongod = await MongoMemoryServer.create({
        binary: {
          version: '4.4.18'
        }
      });

      const uri = mongod.getUri()
      await mongoose.connect(uri)
      console.log('🧪 MongoDB em memória (TEST)')
    } else {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI não definida');
      }

      await mongoose.connect(process.env.MONGO_URI)
      console.log('🟢 MongoDB conectado')
    }
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error)
    process.exit(1)
  }
}

async function disconnectDB() {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
}

module.exports = connectDB
