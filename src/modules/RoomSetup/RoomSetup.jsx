import { useEffect, useState } from "react";

import { useGameState } from "../../context/GameStateContext";

import socket from "../../socket";

import { decrypt } from "../../shared/shared";

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




  return (
    <div>
      <div className="text-black">
        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <br />
        <br />
        {
          room !== "" && (
            <>
              <input
                type="text"
                placeholder="Enter Room Number"
                value={room}
                disabled={true}
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />

              <button type="submit" onClick={joinRoom} className="p-2 bg-blue-700 rounded-md ms-3 text-white">Join Room</button></>
          )
        }
        {
          room === "" && (
            <>
              <input
                type="text"
                value={newRoom}
                placeholder="Enter Room Number to create new room"
                onChange={(event) => {
                  setNewRoom(event.target.value);
                }}
              />
              <button type="submit" onClick={createRoom} className="p-2 bg-blue-700 rounded-md ms-3 text-white">Create Room</button>
            </>
          )
        }

      </div>
    </div>
  );
};

export default RoomSetup;
