import mongoose from 'mongoose'
import UsuariosModel from '../../models/usuariosModel.js'
import objectUtils from '../utils/objectUtils.js'



class SessionService {
    constructor() {
    this.url = process.env.MONGO_REMOTE_CONNECT;
    this.mongodb = mongoose.connect
    }

    //funciones
    async conectarDB() {
    this.mongodb(this.url)
    }

    async buscarUsuarioPorEmail(email) {
    await this.conectarDB()
    const usuario = await UsuariosModel.findOne({ email })
    return usuario
    }

    async registrarUsuario(usuario) {
    await this.conectarDB()
    const userExist = await UsuariosModel.findOne({ email: usuario.email })
    if (userExist) return false
    usuario.password = objectUtils.createHash(usuario.password)
    const newUser = new UsuariosModel(usuario)
    await newUser.save()
    return true
    }
}

export default SessionService