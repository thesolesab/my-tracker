import type { CoffeeShop } from '../model/types'

interface LatLng {
    lat: number
    lng: number
}

interface OverpassElement {
    id: number
    lat: number
    lon: number
    tags?: {
        name?: string
    }
}

interface OverpassResponse {
    elements: OverpassElement[]
}

export const fetchCoffeeShopsByBounds = async (
    northEast: LatLng,
    southWest: LatLng
): Promise<CoffeeShop[]> => {
    // Формат для Overpass API: (south, west, north, east)
    const query = `
    [out:json];
    node
      ["amenity"="cafe"]
      (${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng});
    out;
  `

    const response = await fetch(
        'https://overpass-api.de/api/interpreter',
        {
            method: 'POST',
            body: query,
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch coffee shops')
    }

    const data: OverpassResponse = await response.json()

    return data.elements
        .filter((el) => el.tags?.name)
        .map((el) => ({
            id: el.id.toString(),
            name: el.tags?.name || 'Unnamed cafe',
            lat: el.lat,
            lng: el.lon,
        }))
}