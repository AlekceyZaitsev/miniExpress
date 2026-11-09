import http from "node:http";

declare module "http" {
  interface IncomingMessage {
    body?: unknown;
  }
}
