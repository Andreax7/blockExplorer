import { useEffect, useState } from "react";
import './style/search.css';

const SearchResults = (props) => {

    const [blockDetails, setBlockDetails] = useState()
    const [txDetails, setTxDetails] = useState()
    const [val, setVal] = useState("")

    const requestOptions = {
        method: "GET",
        headers: { "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  }
    };

    function convertTime(time){
        const converted = new Date(time * 1000).toGMTString()
        return converted
    }

    async function getTx(val){
        const resp = await fetch(`http://localhost:3001/transactions/${val}`, requestOptions)
        const respJson = await resp.json()
        props.setSearchQuery(respJson)
        return respJson
    }

    async function getNewTxDetails(e){
        await getTx(e).then(res=>res)
    }

    useEffect(()=>{
       
        if(props.searchQuery.res){
            console.log('transakcija ',props.searchQuery.res)
            setVal("t")
            console.log(props.searchQuery.res.confirmations)
            setTxDetails([props.searchQuery])
        }
        if(props.searchQuery.hash){
            console.log('blok ',props.searchQuery.hash)
            setVal("b")
            setBlockDetails([props.searchQuery])
        }
    },[props.searchQuery])
    
console.log(txDetails, blockDetails)

if(txDetails || blockDetails)
    return(
      <>
        {val==="t" &&
        <div>
            <h2> THESE ARE TRANSACTION RESULTS </h2>
            <p id="txid">TRANSACTION ID: {txDetails[0].res.txid}</p>
                    <div className="txRow">
                            <div className="col1">
                                {txDetails[0].res.confirmations ? <p> STATUS: {txDetails[0].res.confirmations} CONFIRMATIONS</p> : <p>STATUS: UNCONFIRMED</p>}
                                <p> INCLUDED IN BLOCK  {txDetails[0].res.blockhash}</p>
                                <p> SIZE  {txDetails[0].res.size} B</p>
                                <p> WEIGHT UNITS {txDetails[0].res.weight} WU</p>
                                <p> BLOCK TIMESTAMP  {convertTime(txDetails[0].res.blocktime)}</p>
                                <p> TRANSACTION FEES  {txDetails[0].fee} tBTC</p>
                            </div>
                            <div className="col"></div> 
                    </div>

            <div className="txRow" id="txRow2">
                <div className="col">
                    <p>input transactions </p>
                    <table>
                            <tbody>
                                {
                                    (txDetails[0].res.vin).map( ins =>{
                                        return <tr onClick={()=> getNewTxDetails(ins.txid)}><td>{ins.txid }</td></tr>
                                    })
                                } 
                            </tbody>
                  
                    </table>
                </div>
                <div className="col">
                    <p>addreses sended to </p>
                        <table>
                        <tbody>
                        {
                            (txDetails[0].res.vout).map( outs => {
                                return <div>
                                    <p>address hash: { outs.scriptPubKey.addresses[0] }</p>
                                    <p>btc sended: { outs.value }BTC</p>
                                </div>
                                
                            })
                        } 
                        </tbody>
                        </table>
                </div>
            </div>
        </div>
        }
            
        {val==="b" && 
            <div>
            <p> THESE ARE BLOCK RESULTS</p>
            <p id="txid">BLOCK HASH: {blockDetails[0].hash}</p>
                    <div className="txRow">
                            <div className="col">
                                {blockDetails[0].confirmations ? <p> STATUS: {blockDetails[0].confirmations} CONFIRMATIONS</p> : <p>STATUS: UNCONFIRMED</p>}

                                <p> HEIGHT  {blockDetails[0].height}</p>
                                <p> MERKLE ROOT {blockDetails[0].merkleroot} </p>
                                <p> SIZE  {blockDetails[0].size} B</p>
                                <p> WEIGHT UNITS {blockDetails[0].weight} WU</p>
                                <p> BLOCK TIMESTAMP  {convertTime(blockDetails[0].time)}</p>
                                <p> NONCE  {(blockDetails[0].nonce).toString(16)} </p>
                                <p> DIFFICULTY  {blockDetails[0].difficulty} </p>
                                <p> BITS  {blockDetails[0].bits} </p>
                                <p> NUMBER OF TRANSACTIONS  {blockDetails[0].nTx}</p>
                            </div>
                        
                            <div className="col" >
                            <p>Transaction hashes</p>
                                <div id="txArrayTable">
                                    <table >
                                        <tbody>{
                                            (blockDetails[0].tx).map( txs => {
                                                return <tr key={txs} onClick={()=> getNewTxDetails(txs)}><td>{txs}</td></tr>
                                            }) 
                                      
                                        }</tbody>
                                    </table>
                                </div>
                                    
                            </div> 
                    </div>
        </div>
        }
    </>
    )
}


export default SearchResults;