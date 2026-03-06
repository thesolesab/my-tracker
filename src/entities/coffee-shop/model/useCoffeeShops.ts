import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { fetchCoffeeShopsByBounds } from '@/entities/coffee-shop/api/fetchCoffeeShops'
import type { CoffeeShop } from '@/entities/coffee-shop/model/types'

export const useCoffeeShopsInView = () => {
    const map = useMap()
    const [bounds, setBounds] = useState<{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } } | null>(null)

    useEffect(() => {
        if (!map) return

        const updateBounds = () => {
            const b = map.getBounds()
            setBounds({ northEast: b.getNorthEast(), southWest: b.getSouthWest() })
        }

        map.on('moveend', updateBounds)
        updateBounds() // подгружаем сразу при рендере

        return () => {
            map.off('moveend', updateBounds)
        }
    }, [map])

    const { data: coffeeShops, isLoading, error } = useQuery(
        ['coffeeShops', bounds],
        () => {
            if (bounds !== null) {
                fetchCoffeeShopsByBounds(bounds.northEast, bounds.southWest)
            }
        },
        { enabled: !!bounds, keepPreviousData: true }
    )

    return { coffeeShops: coffeeShops || [], isLoading, error }
}