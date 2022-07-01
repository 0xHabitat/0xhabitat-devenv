import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
require('hardhat-gemcutter');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const hardhatSettings = {
  solidity: "0.8.15",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_RINKEBY_URL,
      },
      timeout: 100000
    },
  },
};

export default hardhatSettings
