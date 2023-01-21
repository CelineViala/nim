
import style from'./Match.module.css';

import {useEffect,useState,useRef} from "react"
import matchPicture from './match.png'


function Match(props) {
  const textRef=useRef(null)
  const [isActive,setIsActive]= useState(false)
  const [isValidated,setIsValidated]= useState(false)
  const [mustDisappear,setMustDisappear]= useState(false)
  const handleClick= (e)=>
  {
    if (!props.onClicKMatch(e)) return
    if(props.socket.id !==props.currentPlayer.id) return
    setIsActive(!isActive);
  
    
    
  }
  
  useEffect(()=>{
    props.socket.on("deco_adv",(data)=>{
      setMustDisappear(false)
  })
    props.socket.on("actived",(data)=>{
      if(textRef.current.getAttribute("id")===data.match) setIsActive(data.active);
    })
    props.socket.emit("selectedMatch",{match:textRef.current.getAttribute("id"), adv:props.adv, active:isActive})
    props.socket.on("deco_adv",(data)=>{
      setIsActive(false)
   })
    props.socket.on("undisplay",(data)=>{
      if(textRef.current.getAttribute("id")===data)
      setMustDisappear(true)
   })
   if(props.choosen.includes(textRef.current.getAttribute("id"))){
      setMustDisappear(true)
      props.socket.emit("idToUndisplay",{id:textRef.current.getAttribute("id"), adv:props.adv})
   }
  //  if(props.choosen.find(textRef.current.getAttribute("id")!==-1)){
  //   console.log("a virer")
  //  }

  },[props.socket,isActive,props.choosen])
  return (
    
      <img  id={props.id} ref={textRef} className={`${style.match} ${isActive?`${style['match-select']}`:''} ${mustDisappear?`${style['hidden']}`:''}`} src={matchPicture} alt="allumette" onClick={handleClick} /> 
      
    
  );
}

export default Match;
