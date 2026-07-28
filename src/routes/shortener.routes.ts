import { Router } from "express";
import short, { analytics, deleteUrl, geturl, getUserUrls, updateUrl } from "../controllers/shortener.controller";
import validateBody from "../middlewares/validate.middleware";
import { createUrlSchema, updateUrlSchema } from "../schemas/short.schema";

const shortenerRouter = Router()

// make shorturl
shortenerRouter.post('/',validateBody(createUrlSchema),short)

// analytics of shortocde
shortenerRouter.get('/analytics/:shortcode',analytics)

// url of loggedin user
shortenerRouter.get('/myurls',getUserUrls)

// update url
shortenerRouter.patch('/:shortcode',validateBody(updateUrlSchema),updateUrl)


// delete shortcode
shortenerRouter.delete('/delete/:shortcode',deleteUrl)

// getting shortcode
shortenerRouter.get('/:shortcode',geturl)

export default shortenerRouter