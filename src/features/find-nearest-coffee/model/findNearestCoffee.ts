import type { CoffeeShop } from '@/entities/coffee-shop/model/types'
import { getDistance } from './getDistance'

export const findNearestCoffee = (
    userLat: number,
    userLng: number,
    shops: CoffeeShop[]
): CoffeeShop | null => {
    if (!shops.length) return null

    let nearest = shops[0]
    let minDistance = getDistance(
        userLat,
        userLng,
        nearest.lat,
        nearest.lng
    )

    for (const shop of shops) {
        const distance = getDistance(
            userLat,
            userLng,
            shop.lat,
            shop.lng
        )

        if (distance < minDistance) {
            minDistance = distance
            nearest = shop
        }
    }

    return nearest
}