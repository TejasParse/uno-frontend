import React from 'react'
import { useGameState } from '../../context/GameStateContext';

const Winners = () => {

    const { state } = useGameState();

    const userDetails = state.userDetails || {};

    const winnersList = state.winners || [];

    return (
        <div>
            <div className='text-center text-xl mb-2'>Leaderboard</div>
            {
                winnersList?.map((elmt, index)=> (
                    <div className={`text-${userDetails.username === elmt.username ? "blue-400" : "white"}`}>
                        {index+1}. {elmt.username}
                    </div>
                ))
            }
        </div>
    )
}

export default Winners