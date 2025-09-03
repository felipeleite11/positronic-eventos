'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

interface LeafletMapProps {
	lat: number
	lng: number
	marker_message: string
}

export default function LeafletMap({ lat, lng, marker_message }: LeafletMapProps) {
	useEffect(() => {
		// Garante que o mapa só seja renderizado no client
	}, [])

	return (
		<div className="overflow-hidden rounded-md">
			<MapContainer
				center={[lat, lng]}
				zoom={16}
				maxZoom={19}
				style={{ height: '300px', width: '580px' }}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[lat, lng]}>
					<Popup>
						{marker_message}
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	)
}
