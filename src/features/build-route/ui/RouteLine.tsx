import { Polyline } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'

export const RouteLine = ({ route }: { route: [number, number][] }) => {
    const positions: LatLngTuple[] = route.map(([lng, lat]) => [lat, lng])

    return (
        <Polyline
            positions={positions}
            pathOptions={{ color: 'blue', weight: 5 }}
        />
    )
}