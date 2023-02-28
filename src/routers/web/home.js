import { Router } from 'express'
import { webAuth } from '../../auth/index.js'
import { fork } from 'child_process'
import compression from 'compression'

import path from 'path'

const productosWebRouter = new Router()

productosWebRouter.get('/home', webAuth, (req, res) => {
    res.render(path.join(process.cwd(), '/views/pages/home.ejs'), { nombre: req.session.passport?.user })
})

productosWebRouter.get('/productos-vista-test', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/views/productos-vista-test.html'))
})

// productosWebRouter.get('/info', (req, res) => {
//     res.render(path.join(process.cwd(), 'views/info.ejs'), {
//         argsEntrada: process.argv.slice(2), 
//         sistOperativo: process.platform, 
//         node: process.version, 
//         rss: process.memoryUsage.rss(), 
//         pathEjecucion: process.execPath, 
//         pid: process.pid, 
//         carpetaProyecto: process.cwd()})
// })

productosWebRouter.get('/api/randoms', (req,res)=>{
    const child = fork('./src/randomNumber/randomNum.js')
    const cantNum =  req.query.cantNum || 100000000
    child.on('message', (childMsg)=>{
        if (childMsg == 'Listo') {
            child.send('Iniciar ' + cantNum)
        } else {
            res.render('randomNum', {childMsg: JSON.stringify(childMsg)})
        }
    })
})

productosWebRouter.get("/info", (req, res) => { //info sin compression
    res.render('info', {
        argsEntrada: process.argv.slice(2),
        sistOperativo: process.platform,
        node: process.version,
        rss: process.memoryUsage.rss(),
        pathEjecucion: process.execPath,
        pid: process.pid,
        carpetaProyecto: process.cwd()
    })
})

productosWebRouter.get("/infoZip", compression(), (req, res) => { //info con compression
    res.render('info', {
        argsEntrada: process.argv.slice(2),
        sistOperativo: process.platform,
        node: process.version,
        rss: process.memoryUsage.rss(),
        pathEjecucion: process.execPath,
        pid: process.pid,
        carpetaProyecto: process.cwd()
    })
})

export default productosWebRouter