import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import http from "http";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import dotenv from "dotenv";
import { Request, Response } from "express";
import { PubSub } from "graphql-subscriptions";
import schema from "./schema";
import { User } from "./types/user";
import sequelize from "./utils/db_connection";

const pubSub = new PubSub();

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

interface MyContext {
  req: Request;
  res: Response;
  // pubSub: PubSub;
  token?: string;
}

interface CustomJwtPayload extends JwtPayload {
  user: User;
}

var corsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};

const server = new ApolloServer<MyContext>({
  schema: schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  app.use(
    "/graphql",
    [cors<cors.CorsRequest>(corsOptions), json(), cookieParser()],
    expressMiddleware(server, {
      context: async ({ req, res }: { req: Request; res: Response }) => {
        const { token } = req.cookies;

        const secret = process.env.JWT_SECRET;

        if (token) {
          const decoded = jwt.verify(
            token,
            secret as Secret
          ) as unknown as CustomJwtPayload;

          const user = decoded.user;
          if (!user) {
            // throw new GraphQLError("User is not authenticated", {
            //   extensions: {
            //     code: "UNAUTHENTICATED",
            //     http: { status: 401 },
            //   },
            // });
          } else {
            (req as Request & { user: User }).user = user;
          }
        } else {
          // throw new GraphQLError("Token not found!", {
          //   extensions: {
          //     code: "UNAUTHENTICATED",
          //     http: { status: 401 },
          //   },
          // });
        }

        return { req, res, pubSub };
      },
    })
  );

  new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  ).then(() => {
    sequelize;
    console.log(
      `\n🚀  Server ready at http://${process.env.MY_NW_IP}:${process.env.PORT}/graphql`
    );
  });
});

// https://github.com/cher-yeros/e-commerce-auth.git
