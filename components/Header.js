// we will do yarn add we3uikit for this section, this is an easier way to make our connect button that we did in ManualHeader

import {ConnectButton} from "web3uikit"

export default function Header() {
    return( <nav className =" p-5 border-b-2 flex flex-row">
         <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false}/>
        <div className="ml-auto py-2 px-4">Button exported from web3uikit</div>
        </div>.
    </nav>)
}