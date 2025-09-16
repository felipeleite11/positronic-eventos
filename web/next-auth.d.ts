import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
      id: string
      name: string
      image?: string | null
      person: Person
      person_id: string
      email: string
  }

  interface Session {
    user: {
      id: string
      name: string
	    image?: string | null
      person: Person
      person_id: string | null
      email: string | null
    }
    token: string
  }

  interface JWT {
    id?: string
    name?: string
	  image?: string
    person_id?: string
    person?: Person
    email?: string
    token?: string
  }
}
