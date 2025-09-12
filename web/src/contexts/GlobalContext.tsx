import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { api } from "@/services/api"

interface GlobalContextProps {
	user: User | null
	person: Person | null
	setUser: Dispatch<SetStateAction<User | null>>
}

export const GlobalContext = createContext({} as GlobalContextProps)

export function GlobalContextProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [person, setPerson] = useState<Person | null>(null)

	async function fillPerson(user: User) {
		const { data } = await api.get(`person/by_user/${user.id}`)

		setPerson(data)
	}

	useEffect(() => {
		if(user) {
			fillPerson(user)
		}
	}, [user])

	return (
		<GlobalContext.Provider 
			value={{
				user,
				person,
				setUser
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}