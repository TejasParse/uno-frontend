
import { useEffect, useState, useCallback } from "react";

import Player from "./modules/Player/Player";
import Opponent from "./modules/Opponents/Opponent";
import Stacks from "./modules/Stacks/Stacks";
import RoomSetup from "./modules/RoomSetup/RoomSetup";
import { useGameState } from "./context/GameStateContext";

import { useSocket } from "./context/SocketContext";
import { getInviteLink } from "./shared/shared";
import { toast } from "react-toastify";

import { motion } from "framer-motion";

function App() {

	const socket = useSocket();

	const { state, dispatch } = useGameState();

	const [serverStatus, setserverStatus] = useState(false);

	useEffect(() => {

		socket?.on("host_message_receive", (data) => {
			console.log("Update Message Received from host", data);
			if (!state.isHost) {
				dispatch({
					type: data.dispatch_type,
					payload: data.data,
				});
			}
		});

		socket?.on("player_message_receive", (data) => {
			console.log("Update Message Received from Player", data);

			dispatch({
				type: data.dispatch_type,
				payload: data.data,
			});

		});


		socket?.on("UPDATE", (data) => {
			console.log("Update this data from admin", data);
			// toast("Admin Update")
			dispatch({
				type: "UPDATE",
				payload: {
					game: data.game,
					userDetails: data.userDetails
				}
			})
		})

		socket?.on("custom_error", (data) => {
			// console.log(data, "We've got this data");
			toast.error(data.message, {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				toastId: data.type
			})

		})

		socket?.on("connect_error", (error) => {
			setserverStatus(false);
		});

		socket?.on("set_host", (data) => {
			dispatch({
				type: "SET_HOST"
			})

		})

		// Event listener for disconnection
		// socket.on("disconnect", (reason) => {
		// 	setserverStatus(false);
		// });


		return () => {
			socket?.off("opponent_joined");
			socket?.off("host_message_receive");
			socket?.off("player_message_receive");
			socket?.off("custom_error");
			socket?.off("UPDATE");
		};
	}, [dispatch, socket]);


	const onClickInvite = () => {

		getInviteLink(state.roomNo);

	}

	const onClickReset = () => {

		socket?.emit("reset_game", {
			roomNo: state.roomNo
		})
		// dispatch({
		// 	type: "reset_game",
		// 	callback: sendHostMessage
		// });

	}

	const checkServer = useCallback(
		async () => {

			fetch(process.env.REACT_APP_API_URL)
				.then((res) => res.json())
				.then(res => {
					console.log(res);
					setserverStatus(true)
				})
				.catch(err => {
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
						<div className="flex justify-center gap-5 items-center py-2">
							<h1 className="text-center text-3xl title-text-font">
								UNO (Room No: {state?.roomNo}) {(state?.isHost ? ("HOST") : "")}
							</h1>
							<motion.button
								className="p-2 rounded-md bg-slate-700 text-white mx-3"
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
							{
								state.isHost ? (
									<>

										<motion.button
											className="p-2 rounded-md bg-slate-700 text-white mx-3"
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
					<RoomSetup serverStatus={serverStatus} />
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
							scale: !serverStatus ? [0.93, 1.07, 0.93] : [],
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
