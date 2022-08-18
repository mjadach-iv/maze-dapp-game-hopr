import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic'

import Board from '../components/board'
import WinOverlay from '../components/win-overlay'
import ReactLogo from '../components/hopr-logo/hopr-icon.svg';



export default function Home() {
  const [win, setWin] = useState(null);
  const childFunc = React.useRef(null);

  const resetGame = () => {
    setWin(null);
    childFunc.current()
  }

  const ComponentWithNoSSR = dynamic(
    () => import('../components/board'),
    { ssr: false }
  )

  return (
    <div className="App">
      <header className="App-header">

      </header>
       <ComponentWithNoSSR
        onWin={setWin}
        childFunc={childFunc}
      />
  {/*    {
        win &&
          <WinOverlay
            win={win}
            onPlayAgain={resetGame}
          />
      } */}

      <img src={ReactLogo} className="App-logo " alt="logo" />
    </div>
  );
}
