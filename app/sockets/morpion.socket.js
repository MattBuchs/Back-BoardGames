import { nanoid } from "nanoid";
import { authenticateSocket } from "../validation/authToken.middleware.js";

export const morpionSocket = (morpionNamespace) => {
    morpionNamespace.use(authenticateSocket);
    const games = {};

    morpionNamespace.on("connection", (socket) => {
        // Créer une nouvelle partie
        socket.on("createGame", (callback) => {
            const gameId = nanoid(12);

            games[gameId] = {
                players: [
                    {
                        id: socket.id,
                        name: socket.user.username,
                        ready: false,
                    },
                ],
                playerTurn: socket.id,
                playerStart: socket.id,
                playerX: { id: socket.id, name: socket.user.username },
                playerO: null,
                reconnection: false,
                score: {
                    player1: 0,
                    player2: 0,
                },
                table: [
                    [{ value: 0 }, { value: 0 }, { value: 0 }],
                    [{ value: 0 }, { value: 0 }, { value: 0 }],
                    [{ value: 0 }, { value: 0 }, { value: 0 }],
                ],
            };

            socket.join(gameId);
            socket.gameId = gameId;
            callback(gameId);
        });

        // Rejoindre une partie existante
        socket.on("joinGame", (gameId, callback) => {
            const game = games[gameId];

            if (game && game.players.length < 2) {
                game.players.push({
                    id: socket.id,
                    name: socket.user.username,
                    ready: false,
                });
                if (!game.playerX)
                    game.playerX = {
                        id: socket.id,
                        name: socket.user.username,
                    };
                else if (!game.playerO)
                    game.playerO = {
                        id: socket.id,
                        name: socket.user.username,
                    };

                socket.join(gameId);
                socket.gameId = gameId;
                socket.currentPlayer = game.players.length;

                callback({ success: true });
            } else {
                callback({
                    success: false,
                    message: "Game is full or does not exist.",
                });
            }
        });

        // Détection du statut "prêt" des joueurs
        socket.on("ready", (gameId, isReplay) => {
            const game = games[gameId];

            if (game.reconnection) {
                const playerTurnExisted = game.players.find(
                    (player) => player.id === game.playerTurn
                );

                if (!playerTurnExisted) {
                    game.playerTurn = socket.id;
                }

                morpionNamespace
                    .to(gameId)
                    .emit(
                        "startGame",
                        game.table,
                        game.playerTurn,
                        game.players,
                        game.score
                    );

                const isWinner = checkWinner(game);
                if (isWinner) {
                    morpionNamespace
                        .to(gameId)
                        .emit("gameOver", game.table, isWinner, game.score);
                } else if (checkEquality(game.table)) {
                    morpionNamespace
                        .to(gameId)
                        .emit("gameOver", game.table, "equality", game.score);
                }

                game.reconnection = false;
                return;
            }

            game.players.map((player) => {
                if (player.id === socket.id) {
                    morpionNamespace.to(socket.id).emit("playerReady");
                    return (player.ready = true);
                }
            });

            let ready = 0;
            game.players.forEach((player) => {
                if (player.ready) {
                    ready++;
                }
            });

            if (ready === 2) {
                if (isReplay) {
                    resetGame(game);
                    morpionNamespace
                        .to(gameId)
                        .emit("resetGame", game.playerTurn);
                } else {
                    game.playerTurn = game.players[0].id;
                }

                morpionNamespace
                    .to(gameId)
                    .emit(
                        "startGame",
                        game.table,
                        game.playerTurn,
                        game.players,
                        game.score
                    );

                game.players.forEach((player) => (player.ready = false));
            }
        });

        // Gérer les mouvements dans le jeu
        socket.on("makeMove", (gameId, coordinate) => {
            const game = games[gameId];

            if (
                game &&
                socket.id === game.playerTurn &&
                game.table[coordinate.row][coordinate.col].value === 0
            ) {
                game.table[coordinate.row][coordinate.col].value =
                    game.playerX.id === socket.id ? 1 : -1;

                // Vérifier si un joueur a gagné
                const winner = checkWinner(game);

                if (winner) {
                    if (winner.name === game.playerX.name)
                        game.score.player1 += 1;
                    if (winner.name === game.playerO.name)
                        game.score.player2 += 1;
                    morpionNamespace
                        .to(gameId)
                        .emit("gameOver", game.table, winner, game.score);
                } else if (checkEquality(game.table)) {
                    morpionNamespace
                        .to(gameId)
                        .emit("gameOver", game.table, "equality", game.score);
                } else {
                    // Alterner le joueur
                    const nextPlayer = game.players.find(
                        (player) => player.id !== socket.id
                    );

                    game.playerTurn = nextPlayer.id;

                    // Envoyer la mise à jour aux joueurs
                    morpionNamespace
                        .to(gameId)
                        .emit("updateGame", game.table, game.playerTurn);
                }
            }
        });

        // Gestion de la déconnexion
        socket.on("disconnect", () => {
            const gameId = socket.gameId;
            if (gameId && games[gameId]) {
                games[gameId].players = games[gameId].players.filter(
                    (player) => player.id !== socket.id
                );
                if (
                    games[gameId].playerX &&
                    games[gameId].playerX.id === socket.id
                )
                    games[gameId].playerX = null;
                if (
                    games[gameId].playerO &&
                    games[gameId].playerO.id === socket.id
                )
                    games[gameId].playerO = null;

                if (games[gameId].players.length === 0) {
                    delete games[gameId];
                } else {
                    games[gameId].reconnection = true;
                    morpionNamespace.to(gameId).emit("playerDisconnected");
                }
            }
        });
    });
};

function resetGame(game) {
    game.table = [
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
        [{ value: 0 }, { value: 0 }, { value: 0 }],
    ];

    const playerTurn = game.players.find(
        (player) => player.id !== game.playerStart
    ).id;

    game.playerTurn = playerTurn;
    game.playerStart = playerTurn;
}

// Fonction pour vérifier le gagnant
function checkWinner(game) {
    const table = game.table;
    const winConditions = [
        // Lignes
        [table[0][0], table[0][1], table[0][2]],
        [table[1][0], table[1][1], table[1][2]],
        [table[2][0], table[2][1], table[2][2]],
        // Colonnes
        [table[0][0], table[1][0], table[2][0]],
        [table[0][1], table[1][1], table[2][1]],
        [table[0][2], table[1][2], table[2][2]],
        // Diagonales
        [table[0][0], table[1][1], table[2][2]],
        [table[0][2], table[1][1], table[2][0]],
    ];

    for (let condition of winConditions) {
        const sum = condition.reduce((acc, cell) => acc + cell.value, 0);
        if (sum === 3) return { symbol: "X", name: game.playerX.name };
        if (sum === -3) return { symbol: "O", name: game.playerO.name };
    }
    return null;
}

// Fonction pour vérifier l'égalité
function checkEquality(table) {
    return table.every((row) => row.every((cell) => cell.value !== 0));
}
