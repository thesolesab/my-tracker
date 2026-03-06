import type { LatLngTuple } from 'leaflet'

export const convertRouteToLatLng = (
    route: [number, number][]
): LatLngTuple[] => {
    return route.map(([lng, lat]) => [lat, lng])
}