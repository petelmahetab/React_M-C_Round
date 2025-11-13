import React from 'react'
import { useState ,useEffect} from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
const [isforward, setIsForward] = useState(false);
const [isbackward, setIsBackward] = useState(false);

//UseEffect for timer

useEffect(() => {
  let timer;
   if(!isforward) return;

   timer=setInterval(()=>{
     setCount((c)=>{
         if(isbackward) return c > 0 ? c-1 : 0; //60--59-58--etc
         return c < 60 ? c+1 : 60; //0-1-2----etc
     })
   },1000);
  return () => clearInterval(timer);
}, [isforward,isbackward])

//HandleStart
const handleStart=()=>{
    setIsForward(true)
    setIsBackward(false);
}
//HandlePause
const handlePause=()=>{
    setIsForward(false);
}
//HandleResume
const handleResume=()=>{
    setIsForward(true)
    // setIsForward(true)
}

//HandleReset
const handleReset=()=>{
   setIsForward(true)
   setCount(0)
}
//HandleBackword
const handleBackword=()=>{
   setIsBackward(true);
   setIsForward(true);
   setCount(60)
}


  return (
    <div>
      <h3 style={{color:'gray'}}>Count :- <span style={{color:'yellow',fontSize:'25px'}}>{count}</span></h3>
      <div style={{display:'flex',gap:'20px'}}>
          <button onClick={handleStart}>Start</button>
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleResume}>Resume</button>
          <button onClick={handleBackword}>Back</button>
          <button onClick={handleReset}>Reset</button>

      </div>
    </div>
  )
}

export default Counter
