
import { useEffect, useState } from "react";

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

  const [serverStatus, setserverStatus] = useState(false);

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

    socket.on("connect_error", (error) => {
      setserverStatus(false);
    });
    
    // Event listener for disconnection
    socket.on("disconnect", (reason) => {
      setserverStatus(false);
    });
    

    return () => {
      socket.off("opponent_joined");
      socket.off("host_message_receive");
      socket.off("player_message_receive");
    };
  }, [dispatch, state.isHost]);


  const onClickInvite = () => {

    getInviteLink(state.players, state.roomNo);

  }

  const onClickReset = () => {
    dispatch({
      type: "reset_game",
      callback: sendHostMessage
    });

  }

  const checkServer = useCallback(
    async () => {

      fetch(process.env.REACT_APP_API_URL)
        .then((res)=> res.json())
        .then(res=> {
          console.log(res);
          setserverStatus(true)
        })
        .catch(err=> {
          // console.log(err, "What the error");
          setTimeout(checkServer, 4000);
        })
  
    },
    [],
  )

  useEffect(() => {
    
    checkServer();
    
  }, [serverStatus, checkServer])
  

  return (
    <div className="">
      <div className="m-3 border-2 border-white p-2">
        {
          state?.roomNo !== -1 && (
            <div className="flex justify-center gap-5 items-center">
              <h1 className="text-center text-3xl pb-3 title-text-font">
                UNO (Room No: {state?.roomNo}) {(state?.isHost ? ("HOST") : "")}
              </h1>
              {
                state.isHost ? (
                  <>
                    <motion.button
                      className="p-2 rounded-md bg-slate-700 text-white m-3"
                      onClick={onClickInvite}
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
                      Get Invite Link
                    </motion.button>
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

        <div className="mb-5">Note: The backend server is hosted on Render (free subscription) so the server might be on sleep due to inactivity. Therefore, Please wait for a min so server restarts</div>
        <div>
          <motion.button
            style={{ backgroundColor: !serverStatus ? "red" : "green" }}
            className="p-2 rounded"
            whileTap={{ scale: 0.95 }}
            whileHover={{
              scale: 1.05,
            }}

            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 1
            }}
            animate={{
              scale: !serverStatus ?  [0.93,1.07, 0.93] : [],
            }}

          >
            Server Status
          </motion.button>
        </div>
      </div>
      <div className="text-center">
        Made with <span className="text-red-600 text-xl">&hearts;</span> by <a href="https://tejasparse.netlify.app/" target="blank">Tejas Ajay Parse</a>
      </div>
    </div>
  );
}

export default App;
