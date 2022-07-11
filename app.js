require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const shortId = require('shortid')
const createHttpError = require('http-errors')
const ShortUrl = require('./models/url.model')
const QRCode = require('qrcode')

const mongodburi = process.env.MONGODB_URI
console.log(mongodburi)
mongoose.connect(mongodburi, {
    dbName: 'URL-shortner',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
}).then(() => console.log('mongoose connected'))
.catch((error) => console.log('Error connecting..' + error))

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }))


app.set('view engine', 'ejs')

// Get request to home page
app.get('/', (req, res, next) => {
    res.render('home',{long_url:""})
});

// Post request to create short id and generate qr
app.post('/', async(req, res, next)=>{
    try {
        const { url } = req.body
        console.log(url)
        if (!url) {
          throw createHttpError.BadRequest('Provide a valid url')
        }
        const urlExists = await ShortUrl.findOne({ url })
        if (urlExists) {
            var qrscr = await QRCode.toDataURL(`${req.headers.host}/${urlExists.shortId}`)
            res.render('home', {
            long_url:url,
            // short_url: `${req.hostname}/${urlExists.shortId}`,
            short_id: `${urlExists.shortId}`,
            short_url: `${req.headers.host}/${urlExists.shortId}`,
            qr_src:qrscr,
          })
          return
        }
        const shortUrl = new ShortUrl({ url: url, shortId: shortId.generate() })
        const result = await shortUrl.save()

        var qrscr = await QRCode.toDataURL(`${req.headers.host}/${result.shortId}`)
        res.render('home', {
            long_url:url,
            // short_url: `${req.hostname}/${urlExists.shortId}`,
            short_id: `${result.shortId}`,
            short_url: `${req.headers.host}/${result.shortId}`,
            qr_src:qrscr,
        })
      } 
      catch (error) {
        next(error)
      }
})

// Get request to long URL with shortId
app.get('/:shortId', async (req, res, next) => {
    try {
      const { shortId } = req.params
      const result = await ShortUrl.findOne({ shortId })
      if (!result) {
        throw createHttpError.NotFound('Short url does not exist')
      }
      res.redirect(result.url)
    } catch (error) {
      next(error)
    }
})
        


const port = process.env.PORT || 3000

app.listen(port,()=> console.log('on port',port));