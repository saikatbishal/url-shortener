const express = require('express'); // FOR USING EXPRESS
const mongoose = require('mongoose'); // FOR USING MONGODB
const ShortUrl = require('./models/shortUrl'); // REQUIRED FOR ONLY THIS PROJECT
const app = express();


mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true

})

const path = require('path'); // to add static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs'); // for using ejs templating language 
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls: shortUrls});
    })
app.get('/users', (req,res) => {
    res.render('users');
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

app.listen(process.env.PORT || 3300); 