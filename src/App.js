
import { useEffect } from "react";

import Player from "./modules/Player/Player";
import Opponent from "./modules/Opponents/Opponent";
import Stacks from "./modules/Stacks/Stacks";
import RoomSetup from "./modules/RoomSetup/RoomSetup";
import { useGameState } from "./context/GameStateContext";
import socket from "./socket";
import { sendHostMessage, getInviteLink } from "./shared/shared";

import { motion } from "framer-motion";

function App() {
  const { state, dispatch } = useGameState();

  useEffect(() => {

    socket.on("opponent_joined", (data) => {

      // console.log("Return again?", data);

      dispatch({
        type: data.dispatch_type,
        payload: {
          username: data.username,
          id: data.id
        },
        callback: sendHostMessage
      });


    });

    socket.on("host_message_receive", (data) => {
      console.log("Update Message Received from host", data);
      if (!state.isHost) {
        dispatch({
          type: data.dispatch_type,
          payload: data.data,
        });
      }
    });

    socket.on("player_message_receive", (data) => {
      console.log("Update Message Received from Player", data);

      dispatch({
        type: data.dispatch_type,
        payload: data.data,
      });

    });

    return () => {
      socket.off("opponent_joined");
      socket.off("host_message_receive");
      socket.off("player_message_receive");
    };
  }, [dispatch, state.isHost]);

  // const onClickInvite = () => {

  //   getInviteLink(state.players, state.roomNo);

  // }

  const onClickReset = () => {
    dispatch({
      type: "reset_game",
      callback: sendHostMessage
    });

  }

  return (
    <div className="">
      <div className="m-3 border-2 border-white p-2">
        {
          state?.roomNo !== -1 && (
            <h1 className="text-center text-3xl pb-3 title-text-font">
              UNO (Room No: {state?.roomNo}) {(state?.isHost ? ("HOST") : "")}
            </h1>
          )
        }
        {state.userDetails?.username ? (
          <>
            <div className="grid grid-cols-12">
              <div className="col-span-6 sm:col-span-8 md:col-span-8 xl:col-span-9 border-2 border-white m-2 p-2">
                <Opponent />
              </div>
              <div className="col-span-6 sm:col-span-4 md:col-span-4 xl:col-span-3 border-2 border-white m-2 p-2">
                <Stacks />
              </div>
            </div>
            <div className="border-2 border-white m-2 p-2">
              <Player />
            </div>
          </>
        ) : (
          <RoomSetup />
        )}
      </div>
      {
        state.isHost ? (
          <>
            {/* <button className="p-2 rounded-md bg-slate-700 text-white m-3" onClick={onClickInvite}>Get Invite Link</button> */}
            <motion.button
              className="p-2 rounded-md bg-slate-700 text-white m-3"
              onClick={onClickReset}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                // border: "2px solid white"
              }}
              transition={{
                bounceDamping: 1, bounceStiffness: 100,
                duration: 0.1
              }}
            >
              Reset Game
            </motion.button>
          </>
        ) : (
          <></>
        )
      }
    </div>
  );
}

export default App;
