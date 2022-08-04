const Crawler = require('crawler');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const c = new Crawler({
    rateLimit: 1000,
    encoding: null,
    jQuery: false,// set false to suppress warning message.
    callback: (err, res, done) => {
        if (err) {
            console.error(err.stack);
        } else {
            fs.createWriteStream("./file/" + res.options.filename).write(res.body);
        }

        done();
    }
});

function sleep(time = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

async function fetchPicture() {
    const { data } = await axios.get('https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json');
    let url = data.imgurl;
    console.info(url);
    c.queue({
        uri: url,
        filename: url.replace(/(.*\/)*([^.]+).*/ig, "$2") + ".jpg"
    });
    await sleep();
}


async function main() {
    let times = 0;
    while (times < 400) {
        await fetchPicture();
        times += 1;
    }
}

main();
