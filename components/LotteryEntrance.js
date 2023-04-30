// first off, we want a function to enter the lottery
import { useWeb3Contract } from "react-moralis"
//import abi from "../constants/abi.json"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIDHex } = useMoralis()
    const chainId = parseInt(chainIDHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    //let entranceFee = "" we need to change this to being a useState hook so that it gets displayed and triggers a re render
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    

    const dispatch = useNotification()
    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the network id
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the network id
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the network id
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the network id
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read the raffle entrance fee
            
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx){  //we can turn functions into constant variables
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
         
    }
    const handleNewNotification = function (){
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div>
            Hi from our LotteryEntrance! ༼ つ ◕_◕ ༽つ
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-red-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded ml-auto "
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                    
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ?<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full px-1 py-1"></div> :<div>Enter Raffle</div>}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>The current number of players is: {numPlayers}</div>
                    <div>The most previous winner was: {recentWinner}</div>
                </div>

            ) : (
                <div>No Raffle Address Found</div>
            )}
        </div>
    )
}
