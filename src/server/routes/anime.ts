import * as express from 'express'
const router = express.Router()
import { listCheck } from '../users_db'
import { getAnimeInfo } from '../anime_db'

router.get('/:id', async function (req, res) {
    try {
        const response = getAnimeInfo(req.params.id)
        listCheck(req.params.id, function (list: unknown) {
            res.render('anime', {
                id: response.ids[0],
                list: list || undefined,
                title: response.title,
                rating_star: response.rating / 0.1,
                votes: response.votes,
                rating: response.rating,
                epA: response.epAired,
                epT: response.epTotal,
                nextEp: response.next_episode,
                Status: response.status,
                Duration: response.duration,
                origName: response.origName,
                Type: response.type,
                Studios: response.studios,
                Genre: response.genres,
                Year: response.year,
                Description: response.description,
                poster: response.poster,
                screen1: response.screen1,
                screen2: response.screen2,
                iframe: response.iframe
            })
        })
    } catch (err) {
        res.status(500).json({ msg: `Internal Server Error.` })
    }
})

export default router
