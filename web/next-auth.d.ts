import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
      name: string
      image?: string
      person_id?: string
      email?: string
  }

  interface Session {
    user: {
      name: string
	    image?: string
      person_id?: string
      email?: string
    }
  }

  interface JWT {
    name?: string
	  image?: string
    person_id?: string
    email?: string
  }
}
