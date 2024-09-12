import { checkersSocket } from "../sockets/checkers.socket.js";
import { morpionSocket } from "../sockets/morpion.socket.js";

export const initializeSocket = (io) => {
    const checkersNamespace = io.of("/checkers");
    const morpionNamespace = io.of("/morpion");

    checkersSocket(checkersNamespace);
    morpionSocket(morpionNamespace);
};
