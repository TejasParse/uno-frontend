import React from 'react'
import { useGameState } from '../../context/GameStateContext';
import { motion } from 'framer-motion';

const PlayerCard = ({ player }) => {

  const { state } = useGameState();
  const userDetails = state.userDetails || {}


  const currentPlayer = state.players[state.current_turn] || {}

  const isUser = userDetails.username === player.username
  const isActive = currentPlayer.username === player.username
  // console.log(currentPlayer, "Current Turn");

  return (
    <div className='col-span-3 p-3'>
      <motion.div
        className={`p-2 rounded-lg`}
        style={{
          backgroundColor: isUser ? "#7c3aed" : "#2563eb",
          border: isActive ? "2px solid white" : ""
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1
        }}
        animate={{
          scale: isActive ? [0.98,1.02, 0.98] : [],
        }}
      >
        <div className='flex flex-row justify-between'>
          <div className=''>{player.username}</div>
          <div>{player.cards?.length}</div>
        </div>

      </motion.div>


    </div>
  )
}

export default PlayerCard