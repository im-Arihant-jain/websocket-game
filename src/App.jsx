import React, { use, useState, useEffect } from "react";
import Square from "./Square/Square"; 
import Swal from 'sweetalert2'
import {io} from "socket.io-client"
import "./App.css";
const renderFrom = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const App = () => {
  const [gameState,setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState('circle');
  const [finishedState,setFinishedState] = useState(false);
  const [winner, setWinner] = useState(null);
  const [finishedarr ,setFinishedStateArr] = useState([]);
  const [playgame, setPlayGame] = useState(false);
  const [socket,setSocket] = useState(null);
  const [playername,setPlayerName] = useState('');
  const [opponentPlayer,setOpponentPlayer] = useState('');
  const checkWinner = () => {
    for(let i = 0; i < 3; i++){
      if(gameState[i][0] === gameState[i][1] && gameState[i][1] === gameState[i][2]){
        setFinishedState(true);
        setFinishedStateArr([3*i+0,3*i+1,3*i+2]);
        return gameState[i][0];
      }
      if(gameState[0][i] === gameState[1][i] && gameState[1][i] === gameState[2][i]){
        setFinishedState(true);
        setFinishedStateArr([3*0+i,3*1+i,3*2+i]);
        return gameState[0][i];
      }
    }
    if(gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]){
      setFinishedState(true);
      setFinishedStateArr([3*0+0,3*1+1,3*2+2]);
      return gameState[0][0];
    }
    if(gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]){
      setFinishedState(true);
      setFinishedStateArr([3*0+2,3*1+1,3*2+0]);
      return gameState[0][2];
    }
    const isDraw = gameState.every(row => row.every(col => col === 'circle' || col === 'cross'));
    if(isDraw){
      setFinishedState(true);
      return 'draw';
    }
  }
  useEffect(() => {
   const winn =  checkWinner();
   if(winn!==undefined){
      setWinner(winn);
    }
  }
  , [gameState]);
  const takePlayerName = async () => { 
    const res = await Swal.fire({
      title: "Enter your Name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Please enter a valid name";
        }
      }
    });
  
    if (res.isConfirmed) {
      console.log("Player Name:", res.value);
      return res.value;
    } else {
      return null; // User canceled
    }
  };
socket?.on("connect",()=>{
  setPlayGame(true);
  
}
) 
  const playOnline = async () => { 
  const name =  await takePlayerName();
  if(name!==null){
    setPlayerName(name);
    
  }
   
  console.log(name);
    const socket = io("http://localhost:3000",{
      autoConnect : true,
    });
    socket.emit("request_to_join",name);
    setSocket(socket);
  }
  if(!playgame){
    return <div className="main-div">
      <button onClick={playOnline} className="playOnline">Play Online</button>
    </div>

  }
  if(playgame && opponentPlayer===''){
    return <div className="waiting">
    WAITING FOR OPPONENT....
  </div>
  }
  return <div className="main-div">
    <div>
      <div className="move-detection">
        <div className="left">YoUrself</div>
        <div className="right">Opponent</div>
      </div>
      <h1 className="game-heading water-background"> Tic-Tac-Toe</h1>
  <div className="square-wrapper">
  {gameState.map((row, rowIndex) => (
      row.map((col, colIndex) => (    
        <Square
        setFinishedState={setFinishedState}
        finishedState={finishedState}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer} 
        finishedarr={finishedarr}
        setGameState = {setGameState}

        id={rowIndex*3 + colIndex} 
        key = {rowIndex*3 + colIndex} />
       
      ))  
  ))}
</div>
<h1 className="finished-state">{finishedState ? winner == 'draw' ?'Draw':`Game Over: Winner ${winner}` : ''}</h1>
    </div>
  </div>;
}
export default App;

