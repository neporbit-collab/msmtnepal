import next from 'next'
import { createServer } from 'node:http'

const port = Number.parseInt(process.env.PORT || '3000', 10)
const hostname = process.env.HOSTNAME || '0.0.0.0'
const app = next({ dev: false, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((request, response) => handle(request, response)).listen(port, hostname, () => {
    console.log(`MSMT Nepal website listening on ${hostname}:${port}`)
  })
}).catch(error => {
  console.error('Unable to start MSMT Nepal website', error)
  process.exit(1)
})
