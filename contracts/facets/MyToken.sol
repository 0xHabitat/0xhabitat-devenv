// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC20Base } from '@solidstate/contracts/token/ERC20/base/ERC20Base.sol';
import { ERC20MetadataStorage } from '@solidstate/contracts/token/ERC20/metadata/ERC20MetadataStorage.sol';
import { SMyToken } from "../storage/SMyToken.sol";

contract MyToken is ERC20Base {
    using ERC20MetadataStorage for ERC20MetadataStorage.Layout;

    function initMyToken(string calldata name, string calldata symbol, uint8 decimals, address luckyGuy) public {
        ERC20MetadataStorage.Layout storage l = ERC20MetadataStorage.layout();

        SMyToken.MyTokenStorage storage mti = SMyToken.initStorage();

        require(!mti.isInitialized, 'Contract is already initialized!');
        mti.isInitialized = true;

        l.setName(name);
        l.setSymbol(symbol);
        l.setDecimals(decimals);

        _mint(luckyGuy, 1000);
    }
}