const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
const { validationBodyRules,checkRules } = require('./validator');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', db.getRank)
app.get('/:id',db.getRankById)
app.post('/',validationBodyRules,checkRules,db.verifyToken, db.changeRank)

app.post('/login',db.login);

app.listen(port, () => {
    console.log(`App is running on port ${port}.`)
})