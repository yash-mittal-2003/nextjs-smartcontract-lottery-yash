//we will basically create a little chunk of HTML that we will then export to places like our index.js
import { useMoralis } from "react-moralis"
import { useEffect } from "react" //core react hook and most popular along with useState

export default function ManualHeader() {
    // let enableWeb3 = true   we are not using this bc this would not show up as the website re renders, we instead use hooks for this added functionality
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis() //useMoralis is like a react hook

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) enableWeb3() //if we disconnect and reload now it will always ask to connect which is annoying so we are making another useEffect for the same
        }

        console.log("Hi!")
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled]) //takes function as its first param and optionally takes a dependancy array as the second //it then monitors the values in the dependancy array and if anything changes it calles the function and RERENDER the frontend
    // no array, run anytine anything re-renders, can lead to circular renders!!!
    // empty array, run once ON LOAD
    // dependency array, run when the stuff in it changes
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3() //will set isWeb3enabled to false
                console.log("Null account found")
            }
        })
    }, [isWeb3Enabled])

    return (
        <div className ="border-b-2">
            <h2 className="py-4 px-4 text-3xl">Decentralised Lottery | shy_orpheus</h2>
            {account /*<button>
                Connected!
            </button>*/ ? (
                <div>
                    {" "}
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}{" "}
                </div>
            ) : (
                <button
                    className="bg-gray-600 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded ml-auto "
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected") //making a rememberance in our window's local storage
                        }
                    
                    }}
                    disabled={isWeb3EnableLoading} //if metamask pops up we dont want them to keep clicking the button
                >
                    Connect
                
                </button>
                
                
            )}
            <div>Manually developed button</div>
        </div>
    )
}
