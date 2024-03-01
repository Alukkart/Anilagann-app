import * as express from 'express'
const router = express.Router()
import { quotes, mainlist, anonses } from '../anime_db'

function randomInteger(min: number, max: number): number {
    const rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
}

/* GET home page. */
router.get('/', async function (_req, res) {
    // if (mainlist) {
    //     const quote = quotes[randomInteger(0, quotes.length - 1)]
    //     res.setHeader('Content-Type', 'text/html')
    //     res.render('index', {
    //         data: mainlist[0],
    //         anime: quote.anime,
    //         quote: quote.quote,
    //         character: quote.character,
    //         anonses: anonses
    //     })
    // } else {
    //     res.status(406)
    //     res.render('minesweeper', {})
    // }
    try {
        const quote = quotes[randomInteger(0, quotes.length - 1)]
        res.setHeader('Content-Type', 'text/html')
        res.render('index', {
            data: mainlist[0],
            anime: quote.anime,
            quote: quote.quote,
            character: quote.character,
            anonses: anonses
        })
    } catch (error) {
        res.status(406)
        res.render('minesweeper', {})
    }
})

export default router
