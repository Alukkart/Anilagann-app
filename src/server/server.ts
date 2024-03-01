/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Express, Request, Response } from 'express'
require('./users_db')
import { mainlist, Filter, toplist } from './anime_db'
const app: Express = express(), port = 1488
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import { globalPath } from '../app'
import path from 'node:path'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'

import account from './routes/account'
import anime from './routes/anime'
import animelist from './routes/animelist'
import copyright from './routes/for-copyright-holders'
import index from './routes/index'
import search from './routes/search'
import top from './routes/top'

// view engine setup
app.set('views', path.join(globalPath, './assets/views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(globalPath, './assets/public')))
app.use(cors())
app.use(helmet({contentSecurityPolicy: false, hsts: true, referrerPolicy: false}))
app.use('/', index)
app.use('/top', top)
app.use('/anime', anime)
app.use('/search', search)
app.use('/account', account)
app.use('/animelist', animelist)
app.use('/for-copyright-holders', copyright)

app.post('/getanimelist', async function (req: Request, res: Response) {
    console.log(req.body)
    if (req.body.genres == undefined && req.body.years == undefined && req.body.status == undefined && req.body.types == undefined && req.body.sort == 'rating') {
        if (toplist[req.body.page] != undefined) {
            res.send(toplist[req.body.page])
        } else {
            res.send(false)
        }
    }
    if (req.body.genres == undefined && req.body.years == undefined && req.body.status == undefined && req.body.types == undefined && req.body.sort == 'date') {
        if (mainlist[req.body.page] != undefined) {
            res.send(mainlist[req.body.page])
        } else {
            res.send(false)
        }
    }
    if (!(req.body.genres == undefined && req.body.years == undefined && req.body.status == undefined && req.body.types == undefined)) {
        const filterdata = Filter(req.body)
        if (filterdata[req.body.page] != undefined) {
            res.send(filterdata[req.body.page])
        } else {
            res.send(false)
        }
    }
})

app.get('/robots.txt', function (_req: Request, res: Response) {
    res.sendFile('/robots.txt')
})

app.get('/data/min.db.json', function (_req: Request, res: Response) {
    res.sendFile(globalPath + '/data/min.db.json')
})

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: (arg0: createError.HttpError<404>) => void) {
    next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'production' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

app.listen(port, () => {
    console.log('server running at http://localhost:%s', port)
})

export default app
