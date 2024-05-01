import * as express from 'express'
const router = express.Router()
import { version, author, homepage, description } from '../../../package.json'

/* GET home page. */
router.get('/', function (_req, res) {
    res.render('about', {
        ver: version,
        author: author,
        git: homepage,
        des: description
    })
})

export default router
