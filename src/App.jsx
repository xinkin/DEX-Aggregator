import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Body from "./Body";
function App() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://tokens.coingecko.com/uniswap/all.json",
        );
        const first50 = response.data.tokens.slice(0, 50);
        setData(first50);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar setIsDisabled={setIsDisabled} />
      <Body isDisabled={isDisabled} data={data} />
    </>
  );
}

export default App;
