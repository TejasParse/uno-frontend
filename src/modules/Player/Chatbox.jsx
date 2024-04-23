import React, { useState } from 'react'

import { useGameState } from '../../context/GameStateContext'
import { sendPlayerUpdate } from '../../shared/shared';

const Chatbox = () => {

    const { state, dispatch } = useGameState();

    const [message, setMessage] = useState('');

    const handleKeyPress = (event) => {

        if (event.key === 'Enter' && message !== "") {

            event.preventDefault();

            console.log("Sending Message", message);

            dispatch({
                type: "send_message",
                payload: {
                    message,
                    type: "chat"
                },
                callback: sendPlayerUpdate
            });

            setMessage("");
        }
    };

    return (
        <div className='border border-white'>
            <div className='bg-rose-500 p-2 text-center title-text-font text-2xl'>
                Chatbox
            </div>
            <div className='h-[350px] overflow-scroll overflow-x-hidden p-2'>
                {
                    state.messages.map(mess=> (

                        <div className='mb-2'>
                            {
                                mess.type === "command" ? (
                                    <div className='bg-slate-600 p-2 rounded'>{mess.message}</div>
                                ) : (
                                    <div className='bg-green-600 p-2 rounded'>{`${mess.sender}: ${mess.message}`}</div>
                                )
                            }
                            
                        </div>

                    ))
                }
            </div>

            <div className='p-3'>
                <input
                    type='text'
                    className='p-3 text-black w-full'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </div>
        </div>
    )
}

export default Chatbox