const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/demos'))
app.set('views', './demos')
// app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.send('line')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
