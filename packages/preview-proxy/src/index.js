import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'

const regEx = new RegExp(/meta +(property|content)="(.+?)" +(property|content)="(.+?)"/g);

async function listener(req, res){ 
    const origin = req?.headers?.origin
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    if (origin === 'https://0.0.0.0:8080' || origin === 'https://localhost:8080' || origin === 'https://127.0.0.1:8080') {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    const requestBody = await new Promise((resolve) => {
        if (req.method == 'POST') {
            let body = '';
            req.on('data', function (data) {
                body += data;
                if (body.length > 1e6)
                    req.connection.destroy();
            });
            req.on('end', function () {
                try {
                    resolve(JSON.parse(body))
                } catch {
                    resolve({})
                }
            });
        } else {
            resolve({})
        }
    })
    const obj = {}
    if ('site' in requestBody) {
        try {
            const response = await fetch(requestBody['site'])
            const body = await response.text()
            for (const match of body.matchAll(regEx)) {
                if (match[1] === 'property') {
                    obj[match[2]] = match[4]
                } else {
                    obj[match[4]] = match[2]
                }
            }
        } catch {
        }
    }
    res.end(JSON.stringify(obj));
}

const options = {
    key: fs.readFileSync('../../../cert/CA/localhost/localhost.decrypted.key'),
    cert: fs.readFileSync('../../../cert/CA/localhost/localhost.crt')
}

const server = https.createServer(options, listener);
server.listen(3000, () => console.log('server running at port 3000'));