require('dotenv/config')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors');

const app = new Koa()
const PORT = process.env.PORT_BC

app.use(bodyParser());
app.use(cors());
app.use(require('./routes.js').routes())

app.listen(PORT, err => {
    if(err) {
      console.log(err); 
      return
    }
    console.log(`Server listening on port: ${PORT}`);
  });

  module.exports =  app  