import { io } from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_API_URL);

export default socket;
