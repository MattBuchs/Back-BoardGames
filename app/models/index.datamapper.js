import client from "../helpers/db.js";

// All of the datamappers
import ExampleDatamapper from "./example.datamapper.js";

// Instanciation while passing client to the constructor
export const exampleDatamapper = new ExampleDatamapper(client);
