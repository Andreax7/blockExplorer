const KoaRouter = require('koa-router')
require('dotenv/config')

const router = new KoaRouter()

const Client = require('bitcoin-core-json')

const client = new Client({ 
    host: 'blockchain.oss.unist.hr',
    username: process.env.USRNAME, 
    password: process.env.PASSWD, 
    port: process.env.PORT2,
    "accept": "application/json" 
})

const round = require('lodash/round')

async function getFeeInTx(txHash){
    try{
        let inputs = []
        let unchanged = false //if tx is coinbase this will change to true
        let totalOut = 0
        let totalIn = 0
        await client.getRawTransaction(txHash,2)
        .then((data) =>{ 
            inputs = data.vin
            outs = data.vout
            for(j = 0; j< outs.length; j++){
                totalOut += data.vout[j].value
            }
        })
       //CALCULATES INPUT TRANSACTION 
        for( let i=0; i< inputs.length; i++){
            let outIndex = inputs[i].vout
            if(outIndex !== undefined){
                await client.getRawTransaction(inputs[i].txid,2)
                .then((data) =>{
                    totalIn += data.vout[outIndex].value 
                })
            }
            if(outIndex === undefined){
                unchanged = true
            }
        }
        if(totalIn === 0 && unchanged){
            return totalOut
        }
        const fee = (totalIn-totalOut)
        return fee
    }catch(err){
        return err
    }   
}

router.get('/blockchain', async ctx => {
    try{
        const aboutObj = []
        const bc = await client.getBlockchainInfo().then((data) => data)
        aboutObj.push({difficulty:bc.difficulty, height:bc.blocks, bestblockhash:bc.bestblockhash})
       // console.log(aboutObj)
        
        ctx.status = 200
        ctx.body = JSON.stringify(aboutObj)
        
        return ctx.body 

    }catch(err){
        throw(err)
    }
})


router.get('/transactions', async ctx => {
    try{
        const TxDetailArr = []
        const TxArray = await client.getRawMempool().then((data) => data)
        if(TxArray){
            if(TxArray.length < 10){
                for(let el=0; el < TxArray.length; el++){
                    let tx = await client.getRawTransaction(TxArray[el],2).then(res => res)
                    let fee = await getFeeInTx(tx.txid).then(res=> res)
                    let roundFee = round(fee,8)
                    let feeBySize = round((round((roundFee*100000000),4)/tx.vsize),2)
                // console.log(fee, feeBySize)
                    TxDetailArr.push({txid:tx.txid, value: round(fee,8), size:tx.size, fee:feeBySize})
                }
            }
            else{
                for(let el=0; el <= 10; el++){
                    let tx = await client.getRawTransaction(TxArray[el],2).then(res => res)
                    let fee = await getFeeInTx(tx.txid).then(res=> res)
                    let roundFee = round(fee,8)
                    let feeBySize = round((round((roundFee*100000000),4)/tx.vsize),2)
                // console.log(fee, feeBySize)
                    TxDetailArr.push({txid:tx.txid, value: round(fee,8), size:tx.size, fee:feeBySize})
                }
            }     
        }    
        ctx.status = 200
        ctx.body = JSON.stringify(TxDetailArr)
        return ctx.body

    }catch(err){
        throw(err)
    }
})

router.get('/blocks', async ctx => {
    try{
        const blockArray = []
        const lastBlockHeight = await client.getBlockCount().then((data) => data)
    
        for( let i = lastBlockHeight-10; i <= lastBlockHeight; i++){
            let blockHash = await client.getBlockHash(i).then(res => res)
            let blockInfo = await client.getBlock(blockHash,1).then(res => res)
         //   console.log(blockInfo)
            let blockInfoObj = { hash: blockInfo.hash, height: blockInfo.height, size: blockInfo.size, timestamp: blockInfo.time, difficulty: blockInfo.difficulty, nTx: blockInfo.nTx}
            blockArray.push(blockInfoObj)
        }
              
        ctx.status = 200
        ctx.body = JSON.stringify(blockArray)
        return ctx.body 

    }catch(err){
        throw(err)
    }
})

//search by transaction --> get tx details
router.get('/transactions/:txid', async ctx => {
    try{
        const res = await client.getRawTransaction(ctx.params.txid, 2).then(data => data)
        const fee = await getFeeInTx(ctx.params.txid).then((res) => res) 
        let roundFee = round(fee,8)
        let myRes = {"res":res,"fee":roundFee}
       // console.log(fee)
        ctx.body = JSON.stringify(myRes)
        ctx.status = 200
        return ctx.body 
    }catch(err){
        throw(err)
    }
})

//search by block --> get block details
router.get('/blocks/:blockvalue', async ctx => {
    try{
       // if search by hash
        const height = parseInt(ctx.params.blockvalue) 
        const hash = isNaN(ctx.params.blockvalue) ? ctx.params.blockvalue : await client.getBlockHash(height).then((data) => data)
        ctx.body = await client.getBlock(hash, true).then((data) => data)
        ctx.status = 200
        ctx.set('Access-Control-Allow-Origin', '*')
        return ctx.body 
    }catch(err){
        throw(err)
    }
})


module.exports = router