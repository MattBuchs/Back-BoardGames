import { nanoid } from "nanoid";
import { initializeSquares } from "./initializeSquares.js";

export const checkersSocket = (io) => {
    const checkersNamespace = io.of("/checkers");
    const games = {};

    checkersNamespace.on("connection", (socket) => {
        console.log(
            "Un utilisateur est connecté au namespace checkers",
            socket.id
        );

        socket.on("createGame", ({ userId }, callback) => {
            const gameId = nanoid(12);
            socket.join(gameId);

            games[gameId] = {
                players: [{ id: userId, socketId: socket.id }],
                squares: initializeSquares(),
            };

            callback(gameId);
            console.log(`Game created with ID: ${gameId}`);

            // Inform the creator that the game is waiting for an opponent
            socket.emit("waitingForOpponent");
        });

        socket.on("joinGame", ({ gameId, userId }, callback) => {
            const game = games[gameId];
            if (game) {
                let player = game.players.find((p) => p.id === userId);
                socket.join(gameId);
                if (player) {
                    player.socketId = socket.id;
                    player.disconnected = false;
                    callback({ success: true, squares: game.squares });
                    console.log(
                        `User rejoined game with ID: ${userId} - ${gameId}`
                    );
                } else if (game.players.length < 2) {
                    socket.to(gameId).emit("opponentJoined");

                    game.players.push({ id: userId, socketId: socket.id });
                    const squares = game.squares.reverse();
                    callback({ success: true, squares });
                    console.log(
                        `User joined game with ID: ${userId} - ${gameId}`
                    );
                } else {
                    callback({
                        success: false,
                        message: "Game is full",
                        squares: game.squares,
                    });
                }
            } else {
                callback({
                    success: false,
                    message: "Game not found",
                });
            }
        });

        socket.on("move", (data) => {
            const game = games[data.gameId];
            if (game) {
                game.squares = data.squares.reverse();
                socket.to(data.gameId).emit("move", data);
            }
        });

        socket.on("disconnect", () => {
            console.log("Un utilisateur s’est déconnecté", socket.id);
            for (const gameId in games) {
                const game = games[gameId];
                game.players = game.players.map((player) =>
                    player.socketId === socket.id
                        ? { ...player, disconnected: true }
                        : player
                );
            }
        });
    });
};
