import socket from "../socket";

export const colorScheme = {
    red: "#D72600",
    green: "#379711",
    blue: "#0956BF",
    yellow: "#ECD407",
    black: "#000000"
}

export const sendHostMessage = (overrideData) => {


    const { roomNo, isHost, current_turn, players, winners, direction, selectedIndexes, started, presentCard } = overrideData;

    if(isHost) {
      console.log("Sending Message to everyone", overrideData);
      socket.emit("host_message_send", {
        data: {
          players,
          selectedIndexes: Array.from(selectedIndexes),
          presentCard,
          started,
          current_turn,
          direction,
          winners
        },
        room: roomNo
      });
    }
  }

export const sendPlayerUpdate = (overrideData) => {

  const { roomNo, current_turn, players, winners, direction, selectedIndexes, presentCard } = overrideData;

  socket.emit("player_message_send", {
    data: {
      players,
      selectedIndexes: Array.from(selectedIndexes),
      presentCard,
      current_turn,
      direction,
      winners
    },
    room: roomNo
  });

}

export const isValid = (playingCard, currentCard) => {

  // console.log(playingCard, currentCard, "New Playing and Current Card");

  if(playingCard.type === "number" && currentCard.type === "number") {
    if(playingCard.display_text === currentCard.display_text) {
      return true;
    } else if(playingCard.color === currentCard.color) {
      return true;
    }
  }

  if(playingCard.color === currentCard.color) {
    return true;
  }

  if(playingCard.display_text === currentCard.display_text) {
    return true;
  }

  if(playingCard.type === "power") {
    return true;
  }

  return false;

}

export function encrypt(text) {
  let encryptedText = '';
  for (let i = 0; i < text.length; i++) {
    if (i % 2 === 0) {
      encryptedText += String.fromCharCode(text.charCodeAt(i) + 5);
    } else {
      encryptedText += String.fromCharCode(text.charCodeAt(i) - 7);
    }
  }
  return encryptedText;
}

export function decrypt(encryptedText) {
  let decryptedText = '';
  for (let i = 0; i < encryptedText.length; i++) {
    if (i % 2 === 0) {
      decryptedText += String.fromCharCode(encryptedText.charCodeAt(i) - 5);
    } else {
      decryptedText += String.fromCharCode(encryptedText.charCodeAt(i) + 7);
    }
  }
  return decryptedText;
}

export const getInviteLink = (players, roomNo) => {
  const separator = process.env.REACT_APP_SECRET_KEY;

  let playerTemp = players.map(elm=> elm.username).join(separator);

  playerTemp += `${separator}${roomNo}`

  // navigator.clipboard.writeText(playerTemp)

  console.log(playerTemp, "What id happening");

  const encryptedData = encrypt(playerTemp);

  const urlWithQueryParam = window.location.href + `?inviteQ=${encodeURIComponent(encryptedData)}`;

  console.log("Invite URL= ", urlWithQueryParam);
  navigator.clipboard.writeText(urlWithQueryParam)
  console.log(encryptedData, decrypt(encryptedData));
  // console.log(decryptedData.split(separator));

}