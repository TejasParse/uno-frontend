import { useEffect, useState } from "react";

import { useGameState } from "../../context/GameStateContext";

import socket from "../../socket";

import { decrypt } from "../../shared/shared";

import { motion } from "framer-motion"

const RoomSetup = () => {

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    console.log(urlParams, "URL Params");
    const paramValue = urlParams.get('inviteQ');

    if (paramValue) {
      const separator = process.env.REACT_APP_SECRET_KEY

      const decryptedText = decrypt(paramValue);

      const data = decryptedText.split(separator);

      console.log(data, "We got this from URL");
      const players = data.slice(0, -1);
      const roomNo1 = data[data.length - 1];
      console.log("Room= ", roomNo1);
      setRoom(roomNo1)
      console.log("Players= ", players);
      setExistingPlayers(players);
      setmenuOpen("join")
    }



  }, [])




  const [room, setRoom] = useState("");
  const [existingPlayers, setExistingPlayers] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [name, setName] = useState("");
  const { dispatch } = useGameState();

  const joinRoom = () => {
    // console.log(room, "Room Number");
    if (room === "") {
      alert("Enter a room No");
      return;
    }
    if (name === "") {
      alert("Enter your name");
      return;
    }

    if (existingPlayers.includes(name)) {
      alert("Player with username exists");
      return;
    }

    socket.emit("join_room", {
      roomNo: room,
      username: name,
    });

    dispatch({
      type: "player_joined",
      payload: {
        username: name,
        roomNo: room
      }
    });

  };

  const createRoom = () => {
    // console.log(newRoom, "Room Number");
    if (newRoom === "") {
      alert("Enter a room No");
      return;
    }
    if (name === "") {
      alert("Enter your name");
      return;
    }

    socket.emit("join_room", {
      roomNo: newRoom,
      username: name,
    });

    dispatch({
      type: "player_joined",
      payload: {
        username: name,
        roomNo: newRoom,
      },
    });

    dispatch({
      type: "set_host"
    });
  }


  const [menuOpen, setmenuOpen] = useState("nothing")

  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-4 flex justify-center p-20">
          <img src="/uno.png" className="w-50" />
        </div>
        <div className="col-span-8 flex flex-col items-center justify-center gap-10">

          <div className="text-7xl title-text-font">
            UNO Multiplayer Project
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Your Name"
              onChange={(event) => {
                setName(event.target.value);
              }}
              className="p-3 bg-black text-white rounded-lg helper-font-1 text-xl"
            />
          </div>
          <div className="flex justify-between gap-10">
            <motion.button
              onClick={() => setmenuOpen("create")}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                border: "2px solid white"
              }}
              transition={{
                bounceDamping: 1, bounceStiffness: 100,
                duration: 0.1
              }}
              style={{
                border: menuOpen === "create" ? "2px solid white" : ""
              }}
              className={`p-3 helper-font-1 bg-black rounded flex justify-between items-center gap-4 `}
            >
              <div><img src="/create.png" width={"35px"} /></div>
              <div className="text-xl">Create Room</div>
            </motion.button>
            <motion.button
              onClick={() => setmenuOpen("join")}
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                border: "2px solid white"
              }}
              transition={{
                bounceDamping: 1, bounceStiffness: 100,
                duration: 0.1
              }}
              style={{
                border: menuOpen === "join" ? "2px solid white" : ""
              }}
              className="p-3 helper-font-1 bg-black rounded flex justify-between items-center gap-4"
            >
              <div><img src="/join.png" width={"35px"} /></div>
              <div className="text-xl">Join Room</div>
            </motion.button>
          </div>

          <div className="flex justify-center gap-10">

            {
              menuOpen === "create" && (
                <>
                  <input
                    type="text"
                    value={newRoom}
                    placeholder="Enter a Room Key"
                    onChange={(event) => {
                      setNewRoom(event.target.value);
                    }}
                    className="p-3 bg-black text-white rounded-lg helper-font-1 text-xl"
                  />
                  <motion.button
                    onClick={createRoom}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{
                      scale: 1.05,
                      border: "2px solid white"
                    }}
                    transition={{
                      bounceDamping: 1, bounceStiffness: 100,
                      duration: 0.1
                    }}

                    className="px-2 py-1 text-lg helper-font-1 bg-green-400 rounded text-white gap-4"
                  >
                    Create Room
                  </motion.button>
                </>

              )
            }
            {
              menuOpen === "join" && (

                <>
                  <input
                    type="text"
                    placeholder="Enter Room Key"
                    value={room}
                    // disabled={true}
                    onChange={(event) => {
                      setRoom(event.target.value);
                    }}
                    className="p-3 bg-black text-white rounded-lg helper-font-1 text-xl"
                  />
                  <motion.button
                    onClick={joinRoom}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{
                      scale: 1.05,
                      border: "2px solid white"
                    }}
                    transition={{
                      bounceDamping: 1, bounceStiffness: 100,
                      duration: 0.1
                    }}

                    className="px-2 py-1 text-lg helper-font-1 bg-green-400 rounded text-white gap-4"
                  >
                    Join Room
                  </motion.button>

                </>

              )
            }



          </div>
        </div>
      </div>


    </div>
  );
};

export default RoomSetup;
