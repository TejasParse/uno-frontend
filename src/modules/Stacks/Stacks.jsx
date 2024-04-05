import React from 'react'

import { useGameState } from '../../context/GameStateContext';
import CurrentCard from '../../shared/CurrentCard';

const Stacks = () => {

  const { state } = useGameState();

  const presentCard = state.presentCard

  const cards1 = require("../../context/cards.json");

  return (
    <div>
      <div className='text-center text-xl mb-2'>Current Card</div>
      <CurrentCard presentCard={cards1[presentCard]}/>
    </div>

  )
}

export default Stacks