
import style from './App.module.css';

import io from 'socket.io-client'

import {useEffect,useState,useContext} from "react"
import Game from './Game';
import {DataGameContext} from './contexts/DataGame';
 
function App() {
  const { gameData,setSocket} = useContext(DataGameContext);
  // setSocket(socket);
  console.log(gameData)
  const [message, setMessage]=useState("");
  const [adv, setAdv]=useState({});
  const [boardHidden, setboardHidden]=useState(true);
  const [pseudo, setPseudo] = useState("");
  const [waiting, setWaiting] = useState(false);
  
  
  
  const handlePlay=()=>{
    if(pseudo===''){
      setMessage("Veuillez entrez un pseudo")
      return
    }
    gameData.socket.emit("play",{pseudo});
  }
  useEffect(() => {
     gameData.socket.on("wait",(data)=>{
      if(data.adv){ 
        setAdv(data.adv)
        setboardHidden(false);
        setWaiting(false);        
      }
      else
      {
      setWaiting(true)
     }
     setMessage(data.msg);
      

     })
     gameData.socket.on("id",(data)=>{
      setMessage(data.msg)
      console.log("id",data.id)
     })
     gameData.socket.on("deco_adv",(data)=>{
        alert(data.msg);
        setboardHidden(true);
        setAdv({})
        setMessage("Cliquer sur Jouer pour recommencer une partie.")
     })
     
     
  }, [gameData.socket]);
  return (
    <div className="App">
      <h1>Jeu de Nim</h1>
     
      <Game isHidden={boardHidden} socket={gameData.socket} adv={adv} />

      <label>Pseudo : </label>
      <input
        placeholder="Entre un pseudo"
        onChange={(event) => {
          setPseudo(event.target.value);
        }}
      />
      <p>{message}</p>
      <button className={`${!boardHidden||waiting?`${style.hidden}`:''}`} onClick={handlePlay}>JOUER</button>
      
       
    </div>
  );
}

export default App;
