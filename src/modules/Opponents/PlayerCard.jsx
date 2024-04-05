import React from 'react'
import { useGameState } from '../../context/GameStateContext';

const PlayerCard = ({ player }) => {

    const { state } = useGameState();
    const userDetails = state.userDetails || {}

    
    const currentPlayer = state.players[state.current_turn] || {}

    // console.log(currentPlayer, "Current Turn");

  return (
    <div className='col-span-3 p-3'>
        <div className={`border-2 border-${userDetails.username===player.username ? "blue-400" : "white"} p-2`}>
            <div className='flex flex-row justify-between'>
              <div className=''>{player.username} {currentPlayer.username===player.username ? "*" : ""}</div>
              <div>{player.cards?.length}</div>
            </div>
            
        </div>
        
        
    </div>
  )
}

export default PlayerCard