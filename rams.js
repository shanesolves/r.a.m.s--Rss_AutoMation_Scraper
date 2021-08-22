const puppeteer = require('puppeteer');
//need titles, description, and url 

module.exports = function(url) {
    return new Promise((resolve, reject) => {
        (async () => {
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: ['load', 'networkidle0', 'domcontentloaded']
            });
        await page.waitFor(1000);
        
        // get titles 
        const titlesList = await page.$x('//item/title');
        const allTitles = []
        for (let i = 0; i < titlesList.length; i++) {
            allTitles.push(await (await
                titlesList[i].getProperty('textContent')).jsonValue())
        };
        
        // get video descriptions
        const descriptionsList = await page.$x('//item/description');
        const allDescripts = []
        for (let i = 0; i < descriptionsList.length; i++) {
            allDescripts.push(await (await
                descriptionsList[i].getProperty('textContent')).jsonValue())
        };
        
        // get video urls 
        const urlsList = await page.$x('//item/*["group"=local-name()]/*["content"=local-name()]/@url');
        const allUrls = []
        for (let i = 0; i < urlsList.length; i++) {
            allUrls.push(await (await
                urlsList[i].getProperty('textContent')).jsonValue())
        };
        const filteredUrls = allUrls.filter(item => item)
        
        const data = allTitles.map((_, i) => {
            return {
                title: allTitles[i],
                description: allDescripts[i],
                category: 'Entertainment',
                keywords: '',
                fileUrl: filteredUrls[i],
                ageGate: '0',
                sandbox: '0',
                autoPlay: '1',
                autoMute: '1',
                autoLoop: '1',
                youTubeSync: '0',
                shareButton: '0',
                relatedVideos: '1',
                embedCode: '1'
            }
        })

        const csvString = [
            [
                'Title',
                'Description',
                'Category',
                'Keywords',
                'File URL',
                'Age Gate',
                'Sandbox',
                'Auto Play',
                'Auto Mute',
                'Auto Loop',
                'YouTube Sync',
                'Share Button',
                'Realted Videos',
                'Embed Code'
            ],
            ...data.map(item => [
                item.title,
                item.description, 
                item.category,
                item.keywords,
                item.fileUrl,
                item.ageGate,
                item.sandbox,
                item.autoPlay,
                item.autoMute,
                item.autoLoop,
                item.youTubeSync,
                item.shareButton,
                item.relatedVideos,
                item.embedCode
            ])
        ].map(e => e.join(',')).join('\n')

        await browser.close();

        resolve(csvString);

        })()
    })
}
