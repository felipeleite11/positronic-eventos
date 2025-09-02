import { createContext, ReactNode, useState } from "react"

interface GlobalContextProps {
	user: User | null
	person: Person | null
}

export const GlobalContext = createContext({} as GlobalContextProps)

const fakeUser: User = {
	id: 1,
	person: {
		id: 1,
		name: 'Felipe Leite'
	}
}

export function GlobalContextProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(fakeUser)
	const [person, setPerson] = useState<Person | null>(fakeUser.person)

	return (
		<GlobalContext.Provider 
			value={{
				user,
				person
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}