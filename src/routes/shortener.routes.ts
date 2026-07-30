import { Router } from "express";
import short, { analytics, deleteUrl, geturl, getUserUrls, updateUrl } from "../controllers/shortener.controller";
import validateBody from "../middlewares/validate.middleware";
import { createUrlSchema, updateUrlSchema } from "../schemas/short.schema";
import auth from "../middlewares/auth.middelwares";

const shortenerRouter = Router()

// make shorturl
shortenerRouter.post('/', auth, validateBody(createUrlSchema), short)

// analytics of shortocde
shortenerRouter.get('/analytics/:shortcode', auth, analytics)

// url of loggedin user
shortenerRouter.get('/myurls', auth, getUserUrls)

// update url
shortenerRouter.patch('/:shortcode', auth, validateBody(updateUrlSchema), updateUrl)


// delete shortcode
shortenerRouter.delete('/delete/:shortcode', auth, deleteUrl)

// getting shortcode
shortenerRouter.get('/:shortcode', geturl)

export default shortenerRouter