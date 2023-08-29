import btcIcon from './images/btcIcon.png';
import './style/App.css';
import {React, useEffect, useState} from 'react';
import SearchBar from './SearchBar';
import SearchResult from './SearchResults'
import Latest from './Latest';

function App() {
  const [data, setData] = useState()
  const [searchQuery, setSearchQuery] = useState("")
  const [showDetails, setShow] = useState(false)
  const [latestTx, setLatestTx] = useState([])
  const [latestBlocks, setLatestBlocks] = useState([])
  

  const requestOptions = {
    method: "GET",
    headers: { "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              "Accept": "application/json",
              }
};

async function getData(){
  const resp = await fetch(`http://localhost:3001/blockchain`, requestOptions)
  const respJson = await resp.json()
  setData(respJson[0])
  return respJson[0]
  } 

  async function getTransactions(){
    const resp = await fetch(`http://localhost:3001/transactions`, requestOptions)
    const respJson = await resp.json()
    setLatestTx(respJson)
    return respJson
  }

  async function getBlocks(){
      const resp = await fetch(`http://localhost:3001/blocks`, requestOptions)
      const respJson = await resp.json()
      setLatestBlocks(respJson)
      return respJson
  }


useEffect(() => {
  getData()
},[]);

useEffect(() => {
  getTransactions()
  getBlocks()
},[]);

//console.log(latestBlocks)
  return (
    <div className="App">
      <header className="App-header">
        <img src={btcIcon} className="App-logo" alt="logo" size='50px'/>
          <p id="header">
            <a href="/"> BlockExplorer</a>     
          </p>
        <div className="search">
          <SearchBar setSearchQuery={setSearchQuery} setShow={setShow}> </SearchBar>
        </div>
        {data &&
          <div className='news'>
          <p>current global block difficulty : {Math.round(data.difficulty)}</p>
          <p>latest block height : {data.height}</p>
  
        </div>
        }

      </header>
  
    { showDetails && 
        <div>
          <SearchResult searchQuery={searchQuery} setSearchQuery={setSearchQuery}></SearchResult>
        </div>
        
    }
    { !showDetails && latestTx && latestBlocks && 
        <div className='Latest'>
            {latestTx.length === 0 && 
                  <p>LOADING ...</p>
            }
            <Latest latestTx={latestTx} latestBlocks={latestBlocks} setSearchQuery={setSearchQuery} setShow={setShow}></Latest>
    
        </div>
      
    }
    </div>
  );
}

export default App;
