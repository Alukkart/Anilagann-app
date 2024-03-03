import * as express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function (_req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.render('minesweeper', {
        coldStart: false
    })
})

export default router
