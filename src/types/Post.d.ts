interface Post {
	id: number
	author: User
	url: string | string[]
	content: string
	date: string
	comments?: PostComment[]
	likes?: Like[]
}