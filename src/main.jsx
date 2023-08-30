import * as React from "react";
import App from "./App.jsx";
import "./polyfills";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from "react-dom/client";

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

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
