const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

const PORT = process.env.PORT;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Connected to Database')
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
}); // listen on port 3000

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected')
});// if mongoose is connected
  

