export type RouteData = {
    coordinates: [number, number][]
    distance: number
    duration: number
}

export const fetchRoute = async (
    start: [number, number],
    end: [number, number]
): Promise<RouteData> => {
    const url = `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`

    const res = await fetch(url)
    const data = await res.json()

    const route = data.routes[0]

    return {
        coordinates: route.geometry.coordinates,
        distance: route.distance,
        duration: route.duration
    }
}