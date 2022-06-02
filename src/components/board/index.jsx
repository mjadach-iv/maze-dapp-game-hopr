import React, { useState, useEffect, useRef } from 'react';
import './index.css';

import createMaze from '../../functions/maze'
import { display } from '../../functions/maze'
import { ReactComponent as ReactLogo2 } from '../hopr-logo/hopr-icon.svg';



const rectWidth = 40;
const rectHeight = 40;
// const mazeHeight = 9;
// const mazeWidth = 17;
const mazeHeight = 5;
const mazeWidth = 8;


function App(props) {
  const [maze, setMaze] = useState(null);
  const [playerPosition, setPlayerPosition] = useState([0,1]);
  const [shake, setShake] = useState(false);
  const [win, setWin] = useState(false);
  const mazeRef = useRef();
  const winRef = useRef();
  mazeRef.current = maze;
  winRef.current = win;

  useEffect(() => {
    resetGame();
    document.addEventListener('keydown', keyPressHandler);
    return function cleanupListener() {
      document.removeEventListener('keydown', keyPressHandler);
    }
  }, []);

  useEffect(() => {
    if(maze && playerPosition[0] === maze.length - 1 && playerPosition[1] === maze[0].length - 2){
      console.log('Win!', playerPosition);
      setWin(true);
      props.onWin(1);
    }
  }, [playerPosition]);

  useEffect(() => {
    if(shake) {
      setTimeout(()=>setShake(false), 500);
    }
  }, [shake]);

  React.useEffect(() => {
    props.childFunc.current = resetGame
  }, [])

  const resetGame = () => {
    const mazeObj = createMaze(mazeWidth,mazeHeight,true);
    //  const mazeObj = createMaze(mazeWidth,mazeHeight,false);
    console.log(mazeObj);
    const draw = display(mazeObj);
    console.log(draw);

    setMaze(mazeObj.array)
    setPlayerPosition([0,1]);
    setShake(false);
    setWin(false);
  }

  const keyPressHandler  = (event) => {
    console.log('event.code', event.code);
  
    if(winRef.current) return;

    let maze = mazeRef.current;

    if (event.code === "ArrowUp") {
      setPlayerPosition((poz) => {
        const canMove = poz[0]-1 >= 0 && maze[poz[0]-1][poz[1]] === ' ';
        if(canMove) return [poz[0]-1,poz[1]]
        else {
          setShake(true);
          return poz
        }
      });
    }

    else if (event.code === "ArrowDown") {
      setPlayerPosition((poz) => {
        const canMove = poz[0]+1 < maze.length && maze[poz[0]+1][poz[1]] === ' ';
        if(canMove) return [poz[0]+1,poz[1]]
        else {
          setShake(true);
          return poz
        }
      });
    }

    else if (event.code === "ArrowLeft") {
      setPlayerPosition((poz) => {
        const canMove = maze[poz[0]][poz[1]-1] === ' ';
        if(canMove) return [poz[0],poz[1]-1]
        else {
          setShake(true);
          return poz
        }
      });
    }

    else if (event.code === "ArrowRight") {
      setPlayerPosition((poz) => {
        const canMove = maze[poz[0]][poz[1]+1] === ' ';
        if(canMove) return [poz[0],poz[1]+1]
        else {
          setShake(true);
          return poz
        }
      });
    }
  };


  function renderRect(lineIndex, rowIndex, field) {
    const x = rowIndex * rectWidth;
    const y = lineIndex * rectWidth;
    const wall = field === 'x';
    return (
      <rect  
        x={x}
        y={y}
        width={rectWidth} 
        height={rectHeight}
        className={`ractange lineIndex-${lineIndex} lineRow-${rowIndex} ${wall ? 'wall' : ''}`}
        key={`ractange-lineIndex-${lineIndex}-lineRow-${rowIndex}`}
      />
    )
  }

  return (
    <div 
      className="boardContainer"
   //   onKeyDown={keyPressHandler}
      tabIndex="0"
    >
        <svg 
          viewBox={`0 0 ${(mazeWidth*2+1)*rectWidth} ${(mazeHeight*2+1)*rectHeight}`}
          className="maze-svg" 
        >
          { 
            maze && maze.map((line, lineIndex) => {
                return (
                  line.map((field, rowIndex) => {
                    return renderRect(lineIndex, rowIndex, field)
                  }
                )
                )
              }
            )
          }
          <g 
            className="hopr-logo-maze-player-0-container"
            animation={`${shake}`}
            win={`${win}`}
          >
            <ReactLogo2
              className="hopr-logo-maze-player-0"
              x={ rectWidth * playerPosition[1] + 2 }
              y={ rectHeight * playerPosition[0] + 2 }
              width={ rectWidth - 4 } 
              height={ rectHeight - 4 }
            />
          </g>
        </svg>
    </div>
  );
}

export default App;
