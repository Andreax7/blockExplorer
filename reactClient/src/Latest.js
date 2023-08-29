import './style/latest.css';

const Latest = (props) => {
    const requestOptions = {
        method: "GET",
        headers: { "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  }
    }


    function timeConvert(){

    }
    async function getTx(value){
        const resp = await fetch(`http://localhost:3001/transactions/${value}`, requestOptions)
        const respJson = await resp.json()
        props.setSearchQuery(respJson)
        return respJson
    }

    async function getBlock(value){
      const resp = await fetch(`http://localhost:3001/blocks/${value}`, requestOptions)
      const respJson = await resp.json()
      props.setSearchQuery(respJson)
      return respJson
  }

    async function getDetailsBlock(e){
        getBlock(e)
        console.log('value ',e)
        await getBlock(e).then(res=>res)
        props.setShow(true)
    }
    
    async function getDetailsTx(e){
        console.log('value ',e)
        await getTx(e).then(res=>res)
        props.setShow(true)
    }


    return(
        <div className='grid'>
                <div className='row' id="block">
                    <h2> BLOCKS </h2>
                    <table>
                        <thead>
                            <tr>
                            <th>BLOCK HEIGHT</th>
                            <th>No. TRANSACTIONS</th>
                            <th>SIZE(KB)</th>
                            <th>TIMESTAMP</th>
                            </tr>
                        </thead>
                        <tbody>
                        {props.latestBlocks.map((index) => (
                            <tr key={index.height} onClick={()=>{getDetailsBlock(index.height)}}>
                                <td>{index.height}</td>
                                <td>{index.nTx}</td>
                                <td> {index.size/1000}</td>
                                <td>{index.timestamp}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
          
                <div className='row' id="tx">
                    <h2> TRANSACTIONS </h2>
                    <table>
                        <thead>
                        <tr>
                            <th>TRANSACTION ID</th>
                            <th>VALUE</th>
                            <th>SIZE</th>
                            <th>FEE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {props.latestTx.map((index) => (
                            <tr key={index.txid} onClick={()=>{getDetailsTx(index.txid)}}>
                                <td>{index.txid} </td>
                                <td>{index.value} tBTC</td>
                                <td> {index.size/1000} vB</td>
                                <td>{index.fee} sat/vB</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
          
          
          </div>
    )
    }
    
    
    export default Latest;