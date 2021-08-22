const express = require('express')
const app = express()
const port = process.env.PORT || 3131
const rams = require('./rams');

app.get('/', (req, res) => res.status(200).json({ status: 'ok' }))

app.get('/rams', (req, res) => {
  const url = req.query.url
  ;(async () => {
    const buffer = await rams(url)
    res.setHeader('Content-Disposition', 'attachment; filename="bulkUploadFeed.csv"')
    res.setHeader('Content-Type', 'application/csv')
    res.send(buffer)
  })()
})

app.listen(port, () => console.log(`app listening on port ${port}!`))