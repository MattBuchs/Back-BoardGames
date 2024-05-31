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
        });

        socket.on("joinGame", ({ gameId, userId }, callback) => {
            const game = games[gameId];
            if (game) {
                let player = game.players.find((p) => p.id === userId);
                if (player) {
                    player.socketId = socket.id;
                    socket.join(gameId);
                    callback({ success: true, squares: game.squares });
                    console.log(`User rejoined game with ID: ${gameId}`);
                } else if (game.players.length < 2) {
                    game.players.push({ id: userId, socketId: socket.id });
                    socket.join(gameId);
                    callback({ success: true, squares: game.squares });
                    console.log(`User joined game with ID: ${gameId}`);
                } else {
                    callback({
                        success: false,
                        message: "Game is full",
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
                game.squares = data.squares;
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
