const http=require('http')
const app=require('./app')

const PORT=2600 || process.env.PORT 

const server=http.createServer(app)
server.listen(PORT)