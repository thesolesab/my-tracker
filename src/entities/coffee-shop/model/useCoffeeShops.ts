import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { fetchCoffeeShopsByBounds } from '@/entities/coffee-shop/api/fetchCoffeeShops'

const DEBOUNCE_DELAY = 1500 // мс, задержка перед загрузкой при движении
const MIN_LATITUDE_CHANGE = 0.005 // мин. изменение границ для перезагрузки

interface Bounds {
    northEast: { lat: number; lng: number }
    southWest: { lat: number; lng: number }
}

export const useCoffeeShopsInView = () => {
    const map = useMap()
    const [bounds, setBounds] = useState<Bounds | null>(null)
    const [boundsChanged, setBoundsChanged] = useState(false)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
    const previousBoundsRef = useRef<Bounds | null>(null)

    useEffect(() => {
        if (!map) return

        const updateBounds = () => {
            const b = map.getBounds()
            const newBounds = {
                northEast: b.getNorthEast(),
                southWest: b.getSouthWest(),
            }

            // Проверяем, значительно ли изменились границы
            if (
                previousBoundsRef.current &&
                Math.abs(newBounds.northEast.lat - previousBoundsRef.current.northEast.lat) < MIN_LATITUDE_CHANGE &&
                Math.abs(newBounds.southWest.lat - previousBoundsRef.current.southWest.lat) < MIN_LATITUDE_CHANGE
            ) {
                return // Игнорируем малые изменения
            }

            previousBoundsRef.current = newBounds
            setBounds(newBounds)
            setBoundsChanged(true) // Отмечаем, что границы значительно изменились
        }

        // Сразу загружаем при первом рендере
        updateBounds()

        // На событие moveend добавляем debounce
        const handleMoveEnd = () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
            debounceTimerRef.current = setTimeout(updateBounds, DEBOUNCE_DELAY)
        }

        map.on('moveend', handleMoveEnd)

        return () => {
            map.off('moveend', handleMoveEnd)
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [map])

    const boundsKey = bounds
        ? `${bounds.northEast.lat.toFixed(4)}-${bounds.northEast.lng.toFixed(4)}-${bounds.southWest.lat.toFixed(4)}-${bounds.southWest.lng.toFixed(4)}`
        : null

    const { data: coffeeShops, isLoading, error } = useQuery({
        queryKey: ['coffeeShops', boundsKey],
        queryFn: async () => {
            if (!bounds) return []
            return await fetchCoffeeShopsByBounds(bounds.northEast, bounds.southWest)
        },
        enabled: !!bounds,
        staleTime: 1000 * 60 * 10, // 10 минут
        gcTime: 1000 * 60 * 15, // 15 минут (кэширование неиспользуемых запросов)
    })

    return { coffeeShops: coffeeShops || [], isLoading, error, boundsChanged, setBoundsChanged }
}