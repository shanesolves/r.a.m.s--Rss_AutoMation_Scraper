const rams = require('./rams.js');

const fs = require('fs');

;(async () => {
    const buffer = await rams('https://izismile.com/mrss.php?category=videos')
    console.log(buffer)
    fs.writeFileSync('feed.csv', buffer)
  })()