import dayjs from "dayjs";
import { PubSub } from "graphql-subscriptions";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import User, { UserType } from "../models/user.model";
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
} from "../types/schema-input";

import { Request, Response } from "express";
import { AuthenticationError } from "apollo-server";

const pubsub = new PubSub();

export const userSchema = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    products: [Product!]!
    orders: [Order!]!
    notifications: [Notification!]!
    payments: [Payment!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String
    email: String
  }

  type Query {
    me: User
    getUser(id: ID!): User
    getUsers: [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    signup(input: CreateUserInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
  }

  type Subscription {
    userCreated: User
    userUpdated: User
    userDeleted: ID
  }
`;

export const userResolvers = {
  Query: {
    me: async (
      _: any,
      __: any,
      { res, req }: { res: Response; req: Request }
    ) => {
      const { token } = req.cookies;

      if (!token) {
        return new AuthenticationError("Authentication Token Not Found!");
      }

      const { user } = jwt.verify(
        token,
        process.env.JWT_SECRET as Secret
      ) as JwtPayload;

      return user;
    },
    getUser: async (_: any, { id }: { id: string }) => {
      // Retrieve User logic
      const user = await User.findByPk(id);
      return user;
    },
    getUsers: async () => {
      // Retrieve all Users logic
      const users = await User.findAll();
      return users;
    },
  },
  Mutation: {
    signup: async (_: any, { input }: { input: CreateUserInput }) => {
      const user = await User.create(input);

      return {
        token: "your-auth-token",
        user,
      };
    },
    login: async (
      _: any,
      { input }: { input: LoginInput },
      { res }: { res: Response }
    ) => {
      const user = await User.findOne({
        where: { email: input.email },
        attributes: {
          exclude: ["password"],
        },
      });

      const token = jwt.sign({ user }, process.env.JWT_SECRET as Secret);

      const options = {
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
        secure: false,
        sameSite: false,
      };

      res.cookie("token", token, options);

      return {
        token,
        user,
      };
    },
    createUser: async (_: any, { input }: { input: CreateUserInput }) => {
      // Create User logic
      const user = await User.create(input);
      return user;
    },
    updateUser: async (_: any, { input }: { input: UpdateUserInput }) => {
      const user = await User.update(
        { name: input.name },
        { where: { id: input.id } }
      );
      return user;
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      // Delete User logic
      await User.destroy({ where: { id } });
      return true;
    },
  },
  Subscription: {
    userCreated: {
      // User created subscription logic
      subscribe: () => pubsub.asyncIterator("USER_CREATED"),
    },
    userUpdated: {
      // User updated subscription logic
      subscribe: () => pubsub.asyncIterator("USER_UPDATED"),
    },
    userDeleted: {
      // User deleted subscription logic
      subscribe: () => pubsub.asyncIterator("USER_DELETED"),
    },
  },
};
