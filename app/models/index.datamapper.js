import client from "../helpers/db.js";

// All of the datamappers
import UserDatamapper from "./user.datamapper.js";
import GameDatamapper from "./game.datamapper.js";
import GameUserDatamapper from "./gameUser.datamapper.js";

// Instanciation while passing client to the constructor
export const userDatamapper = new UserDatamapper(client);
export const gameDatamapper = new GameDatamapper(client);
export const gameUserDatamapper = new GameUserDatamapper(client);
