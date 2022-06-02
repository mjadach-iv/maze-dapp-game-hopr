import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import Board from './components/board'
import WinOverlay from './components/win-overlay'
import ReactLogo from './components/hopr-logo/hopr-icon.svg';





function App() {
  const [win, setWin] = useState(null);
  const childFunc = React.useRef(null);

  const resetGame = () => {
    setWin(null);
    childFunc.current()
  }

  return (
    <div className="App">
      <header className="App-header">

      </header>
      <Board
        onWin={setWin}
        childFunc={childFunc}
      />
      {
        win &&
          <WinOverlay
            win={win}
            onPlayAgain={resetGame}
          />
      }

      <img src={ReactLogo} className="App-logo " alt="logo" />
    </div>
  );
}

export default App;
