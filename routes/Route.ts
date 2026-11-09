import http from "http";
import { slicer } from "./slicePath/slicer.ts";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  },
) => void;

type Route = {
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
};

export const createMiniExpress = () => {
  const mainRouterMiniExpress = new Map<Method, Route[]>();

  // * New version - take all method "GET", "POST", "PUT", "DELETE", TS - savior

  const get = (path: string, handler: Handler) =>
    registry("GET", path, handler);
  const post = (path: string, handler: Handler) =>
    registry("POST", path, handler);
  const put = (path: string, handler: Handler) =>
    registry("PUT", path, handler);
  const del = (path: string, handler: Handler) =>
    registry("DELETE", path, handler);

  const registry = (method: Method, path: string, handler: Handler) => {
    if (!mainRouterMiniExpress.has(method)) {
      mainRouterMiniExpress.set(method, []);
    }
    const routes = mainRouterMiniExpress.get(method);
    const { regex, paramNames } = slicer(path);

    routes?.push({ regex, paramNames, handler });
  };

  const handleRequest: Handler = (req, res) => {
    const method = req.method as Method;
    const url = new URL(req.url as string, "http://localhost");
    const path = url.pathname;

    const routes = mainRouterMiniExpress.get(method) || [];
    const route = routes.find((r) => r.regex.test(path));

    if (!route) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Данная страница не найдена");
    }

    // Сразу обрабатываем параметры, не вынося в отдельную функцию
    const matches = path.match(route.regex);
    if (matches) {
      (req as any).params = Object.fromEntries(
        route.paramNames.map((name, index) => [name, matches[index + 1]]),
      );
    }

    if (method === "POST" || method === "PUT") {
      let bodyString = "";
      req.on("data", (chunk) => {
        bodyString += chunk;
      });
      req.on("end", () => {
        try {
          (req as any).body = JSON.parse(bodyString);
          route.handler(req, res);
        } catch (error) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("Некорректный JSON");
        }
      });
    } else {
      route.handler(req, res);
    }
  };
  return { get, post, put, del, handleRequest };
};
