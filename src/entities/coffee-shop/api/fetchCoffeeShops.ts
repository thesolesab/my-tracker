import type { CoffeeShop } from '../model/types'

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

export const fetchCoffeeShops = async (
    lat: number,
    lng: number
): Promise<CoffeeShop[]> => {
    const radius = 1000 // 1 км

    const query = `
    [out:json];
    node
      ["amenity"="cafe"]
      (around:${radius},${lat},${lng});
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