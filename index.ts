import http from "node:http";
import { createMiniExpress } from "./routes/Route.ts";
import { getHandler, postHandler } from "./routes/Handler.ts";

// * Current hub for Todos
export const inMemoryTodo: any = [];

const miniExpress = createMiniExpress();

// * New wersion with custom library MiniExpress

http.createServer(miniExpress.handleRequest).listen(3001);

miniExpress.get("/todos", getHandler);
miniExpress.post("/todos", postHandler);

// ! Old version with detail how build server without library Express
/* const server = http.createServer(
  (
    request: http.IncomingMessage,
    response: http.ServerResponse<http.IncomingMessage> & {
      req: http.IncomingMessage;
    },
  ) => {
    if (request.method === "GET" && request.url === TODOS_ROUTE) {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(inMemoryTodo));
      return;
    }

    if (request.method === "POST" && request.url === TODOS_ROUTE) {
      let str = "";
      request.on("data", (chunk) => {
        str += chunk;
      });

      request.on("end", async () => {
        try {
          let todo = JSON.parse(str);
          response.writeHead(200, { "Content-Type": "application/json" });
          inMemoryTodo.push(todo);
          response.end(JSON.stringify(inMemoryTodo));
        } catch (error) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({
              error: { statusCode: 400, statusMessage: "Bad Request" },
            }),
          );
        }
      });

      return;
    }

    response.end("Request");
  },
); 

server.listen(3001, () => {
  console.log("Server is listening on port 3001");
}); */
