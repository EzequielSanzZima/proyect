import knex from "knex";
import config from "../src/config.js";

const knexConnection = knex(config);
//------------------------------------------
// productos en MariaDb

try {
  console.log("Iniciando Script...");
  await knexConnection.schema.dropTableIfExists("products");
  await knexConnection.schema.dropTableIfExists("messages");

  console.log("Creando tabla...");
  await knexConnection.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.float("price");
    table.string("thumbnail").notNullable();
  });

  await knexConnection.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table.string("user").notNullable();
    table.string("date").notNullable();
    table.string("message").notNullable();
  });
  console.log("tabla mensajes en sqlite3 creada con éxito");

  console.log("insertando registros");
  const products = [
    {
      title: "Pizza",
      price: "234",
      thumbnail:
        "https://media.istockphoto.com/photos/cheesy-pepperoni-pizza-picture-id938742222?k=20&m=938742222&s=612x612&w=0&h=X5AlEERlt4h86X7U7vlGz3bDaDDGQl4C3MuU99u2ZwQ=",
    },
  ];
  await knexConnection("products").insert(products);
  const messages = [
    {
      user: "juan@hotmail.com",
      date: "24/1/2023 20:57:22",
      message: "Hola!!!",
    },
  ];
  await knexConnection('messages').insert(messages)

  console.log("los registros guardados son los siguientes...");
  const result1 = await knexConnection("products").select("*");
  const result2 = await knexConnection("messages").select("*");
  console.log(result1);
  console.log(result2);
} catch (error) {
  console.log(error);
} finally {
  knexConnection.destroy();
}
