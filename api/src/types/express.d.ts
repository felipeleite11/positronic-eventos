import { Socket } from "socket.io"

export {}

declare global {
  namespace Express {
    export interface Request {
      user_id?: number
      person_id?: number
      profile_id?: number
      socket_id?: string
    }
  }
}
