import React from 'react'
import { colorScheme } from './shared'


function CurrentCard({ presentCard, className="", cardNo }) {


    return (
        <div className={className} >
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
        </div>
    )
}

export default CurrentCard