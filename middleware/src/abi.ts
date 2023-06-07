export const orchestrator = [
    {
        "inputs": [
            {
                "internalType": "contract Authority",
                "name": "_authority",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_routeFactory",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_keeperAddr",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_refCode",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "_gmx",
                "type": "bytes"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "InvalidAllowancePercentage",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAsset",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "MismatchedInputArrays",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotRoute",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RouteAlreadyRegistered",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RouteNotRegistered",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RouteTypeNotRegistered",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RouteWaitingForCallback",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroBytes32",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "contract Authority",
                "name": "newAuthority",
                "type": "address"
            }
        ],
        "name": "AuthorityUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_caller",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            }
        ],
        "name": "Deposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_caller",
                "type": "address"
            }
        ],
        "name": "FundsSent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_gmxRouter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_gmxVault",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_gmxPositionRouter",
                "type": "address"
            }
        ],
        "name": "GMXUtilsSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_keeper",
                "type": "address"
            }
        ],
        "name": "KeeperSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_timestamp",
                "type": "uint256"
            }
        ],
        "name": "LastPositionOpenedTimestampUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "_paused",
                "type": "bool"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "_requestKey",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_route",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bool",
                "name": "_isIncrease",
                "type": "bool"
            }
        ],
        "name": "PositionRequestCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_caller",
                "type": "address"
            }
        ],
        "name": "PuppetAccountCredited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_caller",
                "type": "address"
            }
        ],
        "name": "PuppetAccountDebited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "_referralCode",
                "type": "bytes32"
            }
        ],
        "name": "ReferralCodeSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_route",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bool",
                "name": "_freeze",
                "type": "bool"
            }
        ],
        "name": "RouteFrozen",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_trader",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_route",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "_routeTypeKey",
                "type": "bytes32"
            }
        ],
        "name": "RouteRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_route",
                "type": "address"
            }
        ],
        "name": "RouteTokensRescued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "_routeTypeKey",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_collateral",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_index",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "_isLong",
                "type": "bool"
            }
        ],
        "name": "RouteTypeSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "_traders",
                "type": "address[]"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "_allowances",
                "type": "uint256[]"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "_routeTypeKey",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bool",
                "name": "_subscribe",
                "type": "bool"
            }
        ],
        "name": "RoutesSubscriptionUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_throttleLimit",
                "type": "uint256"
            }
        ],
        "name": "ThrottleLimitSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            }
        ],
        "name": "TokensRescued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            }
        ],
        "name": "Withdrawn",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "authority",
        "outputs": [
            {
                "internalType": "contract Authority",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            }
        ],
        "name": "creditPuppetAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            }
        ],
        "name": "debitPuppetAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_route",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_freeze",
                "type": "bool"
            }
        ],
        "name": "freezeRoute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_trader",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_collateralToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_indexToken",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isLong",
                "type": "bool"
            }
        ],
        "name": "getRoute",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_routeKey",
                "type": "bytes32"
            }
        ],
        "name": "getRoute",
        "outputs": [
            {
                "interalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_trader",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_routeTypeKey",
                "type": "bytes32"
            }
        ],
        "name": "getRouteKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_collateralToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_indexToken",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isLong",
                "type": "bool"
            }
        ],
        "name": "getRouteTypeKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gmxPositionRouter",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gmxRouter",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gmxVault",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            }
        ],
        "name": "isBelowThrottleLimit",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isRoute",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "keeper",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            }
        ],
        "name": "lastPositionOpenedTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_pause",
                "type": "bool"
            }
        ],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            }
        ],
        "name": "puppetAccountBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_route",
                "type": "address"
            }
        ],
        "name": "puppetAllowancePercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_allowance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            }
        ],
        "name": "puppetThrottleLimit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "referralCode",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_collateralToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_indexToken",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isLong",
                "type": "bool"
            }
        ],
        "name": "registerRoute",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "_routeKey",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateralDelta",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "sizeDelta",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptablePrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minOut",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IRoute.AdjustPositionParams",
                "name": "_adjustPositionParams",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "address[]",
                        "name": "path",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minOut",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IRoute.SwapParams",
                "name": "_swapParams",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "_executionFee",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_collateralToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_indexToken",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isLong",
                "type": "bool"
            }
        ],
        "name": "registerRouteAndRequestPosition",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "_routeKey",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "_requestKey",
                "type": "bytes32"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateralDelta",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "sizeDelta",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptablePrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minOut",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IRoute.AdjustPositionParams",
                "name": "_adjustPositionParams",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "address[]",
                        "name": "path",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minOut",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IRoute.SwapParams",
                "name": "_swapParams",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "_executionFee",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_route",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isIncrease",
                "type": "bool"
            }
        ],
        "name": "requestRoutePosition",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "_requestKey",
                "type": "bytes32"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_route",
                "type": "address"
            }
        ],
        "name": "rescueRouteTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            }
        ],
        "name": "rescueTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "routeFactory",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "routeType",
        "outputs": [
            {
                "internalType": "address",
                "name": "collateralToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "indexToken",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isLong",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "routes",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            }
        ],
        "name": "sendFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract Authority",
                "name": "newAuthority",
                "type": "address"
            }
        ],
        "name": "setAuthority",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_gmxRouter",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_gmxVault",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_gmxPositionRouter",
                "type": "address"
            }
        ],
        "name": "setGMXInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_keeperAddr",
                "type": "address"
            }
        ],
        "name": "setKeeper",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_refCode",
                "type": "bytes32"
            }
        ],
        "name": "setReferralCode",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_collateral",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_index",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isLong",
                "type": "bool"
            }
        ],
        "name": "setRouteType",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_throttleLimit",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            }
        ],
        "name": "setThrottleLimit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "_routeKey",
                "type": "bytes32"
            }
        ],
        "name": "subscribedPuppets",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "_puppets",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_puppet",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_routeType",
                "type": "bytes32"
            }
        ],
        "name": "updateLastPositionOpenedTimestamp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "_traders",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_allowances",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes32",
                "name": "_routeTypeKey",
                "type": "bytes32"
            },
            {
                "internalType": "bool",
                "name": "_subscribe",
                "type": "bool"
            }
        ],
        "name": "updateRoutesSubscription",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_receiver",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isETH",
                "type": "bool"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
] as const