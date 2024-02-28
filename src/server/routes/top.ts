import * as express from 'express'
const router = express.Router()

router.get('/', async function (_req, res) {
    try {
        res.render('top', {})
    } catch (err) {
        res.status(500).json({ msg: `Internal Server Error.` })
    }
})

export default router
