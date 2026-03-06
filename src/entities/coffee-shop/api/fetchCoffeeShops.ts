import type { CoffeeShop } from '../model/types'

interface LatLng {
    lat: number
    lng: number
}

export const fetchCoffeeShopsByBounds = async (
    northEast: LatLng,
    southWest: LatLng
): Promise<CoffeeShop[]> => {
    // Пример API запроса к вашему серверу или внешнему сервису
    const url = new URL('/api/coffee-shops', window.location.origin)
    url.searchParams.append('neLat', northEast.lat.toString())
    url.searchParams.append('neLng', northEast.lng.toString())
    url.searchParams.append('swLat', southWest.lat.toString())
    url.searchParams.append('swLng', southWest.lng.toString())

    const res = await fetch(url.toString())
    if (!res.ok) {
        throw new Error('Failed to fetch coffee shops')
    }

    const data: CoffeeShop[] = await res.json()
    return data
}