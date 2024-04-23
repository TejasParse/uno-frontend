import React from 'react'
import { colorScheme } from './shared'
import { useGameState } from '../context/GameStateContext';
import { sendPlayerUpdate, isValid } from './shared';
import { motion } from 'framer-motion';

const cards = require("../context/cards.json");

function DisplayCard({ presentCard, className="", cardNo }) {

    const { state, dispatch } = useGameState();
    const userDetails = state.userDetails
    const currentPlayer = state.players[state.current_turn]

    const isActivePlayer = currentPlayer.username === userDetails.username

    const validPlay = isValid(cards[cardNo], cards[state.presentCard])

    const handleOnClick = () => {

        if(!validPlay) {
            return;
        }

        if(isActivePlayer) {

            // console.log(presentCard, cardNo);

            // dispatch({
            //     type: "player_joined",
            //     payload: {
            //       username: name,
            //       roomNo: newRoom,
            //     },
            //     callback: sendHostMessage
            //   });

            dispatch({
                type: "play_card",
                payload: {
                    cardNo: cardNo
                },
                callback: sendPlayerUpdate
            })

        }


    }


    return (
        <motion.div className={className} onClick={handleOnClick} style={
            {
                cursor: isActivePlayer ? (validPlay ? "pointer" : "not-allowed") : "not-allowed"
            }
            
        }
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)" }}
        transition={{
            bounceDamping: 1, bounceStiffness: 100,
            duration: 0.1
          }}
          whileTap={{ scale: 0.95 }}
    
        >
            <div className={`p-2 rounded-2xl`} style={{ backgroundColor: colorScheme[presentCard.color] }}>
                <div className={`text-xl`}>{presentCard.display_text}</div>
                <div className='flex justify-center'>
                    <div className={`bg-white text-black text-6xl text-center my-3 rounded-full h-24 w-24 flex items-center justify-center p-3`}>

                        {
                            presentCard?.display_image ? (
                                <img src={presentCard.display_image} alt={`${presentCard.display_text}`} className='w-100' />
                            ) : (
                                <div>
                                    {presentCard.display_text}
                                </div>
                            )
                        }

                    </div>
                </div>
                <div className='text-end text-xl'>
                    {presentCard.display_text}
                </div>

            </div>
        </motion.div>
    )
}

export default DisplayCard