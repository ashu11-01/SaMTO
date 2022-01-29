const express = require('express')
const mongoose = require('mongoose')
const router = require('./router')
const {passport} = require('./middlewares/passport')
const app = new express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URL, 
{useNewUrlParser : true, useUnifiedTopology : true}, (err) => {
    const msg = err ? err : 'Connected to database!';
    console.log(msg);
})

app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(passport.initialize())
app.use('/',router)

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})