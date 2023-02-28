import log4js from "log4js";
import dotenv from 'dotenv'
dotenv.config()

// configuracion de log4js 
log4js.configure({
    appenders:{
        consola:{type:"console"},
        errores:{type:"file", filename:"./src/logs/errores.log"},
        debug:{type:'file', filename:'./src/logs/debug.log'},
        consolaInfo:{type:'logLevelFilter', appender:'consola', level:'info'},
        consolaError:{type:'logLevelFilter', appender:'consola', level:'error'},
        archivoDebug:{type:'logLevelFilter', appender:'debug', level:'debug'},
        archivoErrores:{type:'logLevelFilter', appender:'errores', level:'error'},
    },
    categories:{
        default:{appenders:['consolaInfo'], level:'all'},
        prod:{appenders:['archivoDebug', 'archivoErrores'], level:'all'}
    }
})

let logger = null
if (dotenv.NODE_ENV === 'development') {
    logger = log4js.getLogger('development')
} else {
    logger = log4js.getLogger()
}

export {logger}