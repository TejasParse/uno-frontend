import React from 'react'
import { useGameState } from '../../context/GameStateContext'
import PlayerCard from './PlayerCard';
import Winners from '../Winners/Winners';

const Opponent = () => {

  const { state } = useGameState();
  // console.log(state?.players, "All the Opponents");
  return (
    <div>
      

      <div className='grid grid-cols-12'>
        <div className='col-span-9'>
          <h1 className='text-lg font-bold mb-2'>Active Players</h1>
          <div className='grid grid-cols-12'>
            {state?.players.map((elmt) => {
              return <PlayerCard player={elmt} />
            })}
          </div>
        </div>
        <div className='col-span-3'>
          <Winners />
        </div>
      </div>

    </div>
  )
}

export default Opponent