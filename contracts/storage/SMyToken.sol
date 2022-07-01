// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SMyToken {
    bytes32 constant MYTOKEN_INIT_POSITION = keccak256("mytoken.init");

    struct MyTokenStorage {
        bool isInitialized;
    }

    function initStorage() internal pure returns (MyTokenStorage storage ds) {
        bytes32 position = MYTOKEN_INIT_POSITION;
        assembly {
            ds.slot := position
        }
    }
}