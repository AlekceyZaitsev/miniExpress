import { type Handler } from "./Route.ts";
import { inMemoryTodo } from "../index.ts";

export const getHandler: Handler = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(inMemoryTodo));
  console.log("Todos delivery");
  return;
};

export const postHandler: Handler = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  inMemoryTodo.push(req.body);
  console.log("Todos is add");
  res.end(JSON.stringify(inMemoryTodo));
  return;
};

export const putHandler = () => {};

export const delHandler = () => {};
