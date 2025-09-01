interface Arena {
	id: number
	name: string
	image: string
	gallery: GalleryImage[]
	region: Region
	modalities?: string[]
	tournaments?: Tournament[]
	address: string
	contacts?: string[]
	business_hours?: string
	day_use?: string
	position?: Position
	regulation_link?: string
	description?: string
	teachers?: Teacher[]
}

interface GalleryImage {
	url: string
	title: string
	description?: string
}

interface Region {
	id: number
	name: string
}

interface Position {
	lat: number
	lng: number
}