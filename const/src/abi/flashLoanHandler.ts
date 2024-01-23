export default [{ inputs:[], name:"NotVault", type:"error" }, { inputs:[], name:"VAULT", outputs:[{ internalType:"contract IVault", name:"", type:"address" }], stateMutability:"view", type:"function" }, { inputs:[{ internalType:"uint256", name:"_amount", type:"uint256" }, { internalType:"address", name:"_token", type:"address" }, { internalType:"address", name:"_treasury", type:"address" }, { internalType:"address", name:"_receiver", type:"address" }], name:"execute", outputs:[], stateMutability:"nonpayable", type:"function" }, { inputs:[{ internalType:"contract IERC20[]", name:"", type:"address[]" }, { internalType:"uint256[]", name:"", type:"uint256[]" }, { internalType:"uint256[]", name:"", type:"uint256[]" }, { internalType:"bytes", name:"", type:"bytes" }], name:"receiveFlashLoan", outputs:[], stateMutability:"view", type:"function" }] as const