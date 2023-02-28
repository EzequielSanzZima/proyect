import dotenv from 'dotenv'
dotenv.config()

export default {
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017'
    },
    mongoRemote: {
        client: 'mongodb',
        cnxStr: process.env.MONGO_REMOTE_CONNECT,
        options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // useCreateIndex: true,
                // serverSelectionTimeoutMS: 5000,
        }    
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: './DB/ecommerce.sqlite'
        },
        useNullAsDefault: true
    },
    fileSystem: {
        path: './DB'
    }
}