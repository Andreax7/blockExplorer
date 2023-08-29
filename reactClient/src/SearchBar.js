
import './style/search.css';
import magnifier from './images/magnifier2.JPG';
import { useState } from "react";
import React from 'react';



const SearchBar = ({setSearchQuery, setShow}) => {
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearchRadio] = useState("")
    const [errMsg, setErrMsg] = useState("")

    const requestOptions = {
        method: "GET",
        headers: { "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  }
    };


    const searchBarUpdate = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      }

    const onOptionChange = e => {
        setSearchRadio(e.target.value)
      }

    async function getTx(){
        const resp = await fetch(`http://localhost:3001/transactions/${searchInput}`, requestOptions)
        const respJson = await resp.json()
        return respJson
    }

    async function getBlock(){
      const resp = await fetch(`http://localhost:3001/blocks/${searchInput}`, requestOptions)
      const respJson = await resp.json()
      console.log(respJson)
      return respJson
  }


    const searchFunction = async () => {

        if(searchInput !== "" && search!==""){
          setErrMsg(" ")
            if(search === "txid"){
                // get transaction details 
                const txDetails = await getTx().then(res=>res)
                setSearchQuery(txDetails)
                //console.log(txDetails)
            }
            if(search === "block"){
                //get block details
                const blockDetails = await getBlock().then(res=>res)
                setSearchQuery(blockDetails)
                //console.log(blockDetails)
            }
          setShow(true)
        }
        else{
            setErrMsg("Error in search fields")
            console.log(errMsg)
        }
        
    }

  return (
    <div className="SearchBar">
        <p>What do you want to search ? </p>

        <input type="radio" name="topping" value="txid" onChange={onOptionChange} />
        <label className="searchLabel">Transaction</label>
       
        <input type="radio" name="topping" value="block" onChange={onOptionChange} />
        <label className="searchLabel">Block</label>
        
        <div className="searchField">
          <input type="text" className="inputSearch" placeholder="Enter here" value={searchInput} onChange={searchBarUpdate}/>
          <button onClick={searchFunction}> <img src={magnifier} className="magnifier" alt="magnifier" size='50px'/></button>
        </div>
        <div className='errMsg'>
          <p>{errMsg}</p>
        </div>
    </div>
  )
}

export default SearchBar;
