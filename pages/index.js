import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import Board from '../components/board'
import WinOverlay from '../components/win-overlay'
import ReactLogo from '../components/hopr-logo/hopr-icon.svg';
import LobbyOverlay from '../components/lobby-overlay'

import WebSockerHandler from '../functions/WebSocketHandler'
import { getPeerId, sendMessage } from '../functions/hopr-sdk'

export default function Home() {  
  const router = useRouter();
  
  const [win, setWin] = useState(null);
  const [lobby, set_lobby] = useState(true);
  const [lobbyId, set_lobbyId] = useState(null);
  const childFunc = React.useRef(null);
 // const hopr = React.useRef({apiToken: 'apiToken-null', apiEndpoint: 'apiEndpoint-null', peerId: 'peerId-null'});
  const hopr = React.useRef({apiToken: 'apiToken-null', apiEndpoint: 'apiEndpoint-null', peerId: 'peerId-null'});
  // const [apiToken, set_apiToken] = useState(null);
  // const [apiEndpoint, set_apiEndpoint] = useState(null);
  // const [gotHoprAPI, set_gotHoprAPI] = useState(false);
   const [gotHoprAPI, set_gotHoprAPI] = useState(true);
 // const [peerId, set_peerId] = useState(null);
  const [remotePos, set_remotePos] = useState([0,1]);

  useEffect(()=>{
    if(!router.isReady) return;
    console.log('router ready:', router)
    // set_apiToken(router.query.apiToken);
    // set_apiEndpoint(router.query.apiEndpoint);
    hopr.current.apiToken = router.query.apiToken;
    hopr.current.apiEndpoint = router.query.apiEndpoint;
    set_gotHoprAPI(true);
  }, [router.isReady]);


  useEffect(() => {
    if(hopr.current.apiEndpoint && hopr.current.apiToken){
      const fetchData = async () => {
        const id = await getPeerId(hopr.current.apiEndpoint, hopr.current.apiToken);
        console.log('Got Peer Id:', id)
        hopr.current.peerId = id;
      }
      fetchData().catch(console.error);
    }
  }, [gotHoprAPI]);
  

  const resetGame = () => {
    setWin(null);
    childFunc.current()
  }

  function newPlayerPosition (input) {
    //sendMessage (apiEndpoint, apiToken, recipientPeerId, message)
    console.log('Index: newPlayerPosition', input, hopr.current.apiEndpoint, hopr.current.apiToken, hopr.current.peerId);
    sendMessage(hopr.current.apiEndpoint, hopr.current.apiToken, hopr.current.peerId, JSON.stringify(input));
  }

  const ComponentWithNoSSR = dynamic(
    () => import('../components/board'),
    { ssr: false }
  )

  function fakeRemote (input) {
    set_remotePos(input)
  }

  
  return (
    <div className="App">
      <header className="App-header">

      </header>
      {console.log('---------------------------------------')}
      <Board
        onWin={setWin}
        newPlayerPosition={newPlayerPosition}
        childFunc={childFunc}
        remotePos={remotePos}
      />
      {
        lobby &&
          <LobbyOverlay
            apiEndpoint={hopr.current.apiEndpoint}
            apiToken={hopr.current.apiToken}
            set_lobbyId={set_lobbyId}
            lobbyId={lobbyId}
          />
      }
      {
        win &&
          <WinOverlay
            win={win}
            onPlayAgain={resetGame}
          />
      }
      {
        hopr.current.apiEndpoint && hopr.current.apiToken &&
        <WebSockerHandler
          apiEndpoint={hopr.current.apiEndpoint}
          apiToken={hopr.current.apiToken}
          onMessage={(input)=>{
            console.log('WS: onMessage', input);
            set_remotePos(JSON.parse(input));
          }}
        />
      }
      <p onClick={()=>{fakeRemote([0,1])}}>Press 0,1</p>
      <p onClick={()=>{fakeRemote([1,1])}}>Press 1,1</p>

      {/* <img src={ReactLogo} className="App-logo " alt="logo" /> */}
    </div>
  );
}
