import React from 'react'
import { useGameState } from '../../context/GameStateContext'
import { sendHostMessage } from '../../shared/shared';
import DisplayCard from '../../shared/DisplayCard';
import { motion } from "framer-motion"

const Player = () => {

  const { state, dispatch } = useGameState();

  const userDetails = state.userDetails
  const isHost = state.isHost;

  const startGame = () => {
    dispatch({
      type: "start_game",
      callback: sendHostMessage
    });
  }

  const currentPlayer = state.players[state.current_turn]

  console.log(state, currentPlayer, userDetails);

  const isActivePlayer = currentPlayer.username === userDetails.username

  const cards1 = require("../../context/cards.json");

  const users = state.players.filter(elmt => elmt.username === userDetails.username)
  const userDet = users[0];

  const winners = state.winners || [];
  const isWinner = winners.some(winner => winner.username === userDetails.username);

  // useEffect(() => {
  //   setresetPage(prev=>prev+1)


  // }, [state.players])


  return (
    <div>
      {
        isHost === 1 && !state.started && (
          <motion.button
            className='bg-blue-600 p-2 rounded mb-5 helper-font-1' onClick={startGame}
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
            Start Game
          </motion.button>
        )
      }
      {
        isWinner ? (
          <div className='flex flex-row justify-start'>
            <div className='bg-green-600 text-white p-3 rounded helper-font-2'>Congrats! You have completed your deck. Check the Leaderboard</div>
          </div>
        ) : (
          <div className='flex flex-row justify-start'>
            <div className='bg-purple-600 text-white p-3 rounded-lg helper-font-2'>
              {
                isActivePlayer ? (
                  <>{state.players.length !== 1 ? "Your Turn" : "Please Add More Players"}</>
                ) : (
                  <>{state.started ? "Please Wait for your turn" : "Please tell your host to start the game"}</>
                )
              }
            </div>

          </div>
        )
      }
      <div className='mt-3 grid grid-cols-12 gap-3 mb-3'>

        {
          (state.started && state.players.length !== 1) ? (
            <>
              {
                userDet?.cards?.map(elmt => (
                  <DisplayCard presentCard={cards1[elmt]} className="col-span-1" cardNo={elmt} />
                ))
              }
            </>
          ) : (
            <></>
          )
        }




      </div>

      <div className='mb-3'>
        {/* {
          isActivePlayer ? (
            <div>Your Turn</div>
          ) : (
            <div>
              { state.started ? "Please Wait for your turn" : "Please tell your host to start the game"}
            </div>
          )
        } */}

        {
          (state.started && state.players.length === 1) ? (
            <div className='mt-3'>The Game Has Ended! Please ask your host to restart the game</div>
          ) : (
            <></>
          )
        }
      </div>


    </div>
  )
}

export default Player