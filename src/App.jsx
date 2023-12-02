import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Body from "./Body";
import "./polyfills";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "Dex Swap",
  projectId: "9ddcc3ecbbeb17611f86111fe67e3a91",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json",
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
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <Navbar setIsDisabled={setIsDisabled} />
          <Body isDisabled={isDisabled} data={data} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
