/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express'
const router = express.Router()
import * as users_db_module from '../users_db'
import { getAnimeInfo } from '../anime_db'

router.get('/profile', function (_req, res) {
    users_db_module.getUserInfo(function (list) {
        res.render('profile', {
            watching: list.filter((el: any) => el.list == 'Смотрю').map((element) => getAnimeInfo(element.animeid)),
            abandoned: list.filter((el: any) => el.list == 'Брошено').map((element) => getAnimeInfo(element.animeid)),
            plan: list.filter((el: any) => el.list == 'В планах').map((element) => getAnimeInfo(element.animeid)),
            viewed: list.filter((el: any) => el.list == 'Просмотренно').map((element) => getAnimeInfo(element.animeid)),
            favorite: list.filter((el: any) => el.list == 'Любимое').map((element) => getAnimeInfo(element.animeid))
        })
    })
})

router.post('/addToList', function (req, res) {
    users_db_module.addToList(req.body.id, req.body.type, function (row: boolean) {
        res.send(row)
    })
})

export default router
