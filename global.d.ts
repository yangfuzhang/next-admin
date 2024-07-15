import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare global {
  interface Window {
    CozeWebSDK: {
      WebChatClient: any;
    };
  }
}

declare module "next-auth" {
  interface User {
    role: string;
    isSuper: number;
  }
  interface Session {
    user: {
      role: string;
      isSuper: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface jwt {
    role: string;
    isSuper: number;
  }
}

export {};
