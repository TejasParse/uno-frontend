import React from 'react'

import { useGameState } from '../../context/GameStateContext';
import CurrentCard from '../../shared/CurrentCard';
import { motion } from "framer-motion"
import { sendPlayerUpdate } from '../../shared/shared';

const Stacks = () => {

  const { state, dispatch } = useGameState();

  const currentPlayer = state.players[state.current_turn]
  const userDetails = state.userDetails

  const isActivePlayer = currentPlayer.username === userDetails.username

  const presentCard = state.presentCard;

  const canPick = (state.started && isActivePlayer && state.players.length >= 2);

  const cards1 = require("../../context/cards.json");

  const pickRandomCard = () => {

    if(!canPick) {
      return;
    }

    // console.log("Clicked Twice?");
    dispatch({
      type: "random_card",
      callback: sendPlayerUpdate
    });
  }

  

  return (
    <div>
      <div className='grid grid-cols-12'>
        <div className='col-span-6 p-3'>
          {/* <div className='text-center text-xl mb-2'>Current Card</div> */}
          <CurrentCard presentCard={cards1[presentCard]} />
        </div>
        <div className='col-span-6 p-3'>

          <motion.div 
            className={`p-2 rounded-2xl`} 
            style={{ 
              backgroundColor: "black",
              cursor: canPick ? "pointer"  : "not-allowed"
            }}
            onClick={pickRandomCard}
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.05,
              border: "2px solid white"
            }}
            transition={{
              bounceDamping: 1, bounceStiffness: 100,
              duration: 0.1
            }}

          >
            <div className={`text-xl`}>Pick</div>
            <div className='flex justify-center'>
              <div className={`bg-white text-black text-6xl text-center my-3 rounded-full h-24 w-24 flex items-center justify-center p-3`}>


                <img src={"/uno.png"} alt={`${presentCard.display_text}`} className='w-100' />



              </div>
            </div>
            <div className='text-end text-xl'>
              Random
            </div>

          </motion.div>

        </div>
      </div>
    </div>

  )
}

export default Stacks