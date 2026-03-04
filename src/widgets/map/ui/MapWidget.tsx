import { useEffect, useState, type FC } from "react"
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { CoffeeMarker } from "@/entities/coffee-shop/ui/CoffeeMarker"
import type { CoffeeShop } from "@/entities/coffee-shop/model/types"
import { useGeolocation } from "@/shared/lib/geolocation/useGeolocation"
import { UserMarker } from "@/shared/ui/UserMarker"
import type { GeolocationState } from "@/shared/lib/geolocation/useGeolocation"
import { useMap } from "react-leaflet"
import { fetchCoffeeShops } from "@/entities/coffee-shop/api/fetchCoffeeShops"
import { useQuery } from '@tanstack/react-query'
import { findNearestCoffee } from '@/features/find-nearest-coffee/model/findNearestCoffee'
import { FindNearestButton } from '@/features/find-nearest-coffee/ui/FindNearestButton'

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo([lat, lng], 15)
    }, [lat, lng, map])

    return null
}

export const MapWidget: FC = () => {
    const { coordinates }: GeolocationState = useGeolocation()
    const [nearest, setNearest] = useState<CoffeeShop | null>(null)

    const { data: coffeeShops = [] } = useQuery({
        queryKey: ['coffee-shops', coordinates],
        queryFn: () =>
            coordinates
                ? fetchCoffeeShops(coordinates.lat, coordinates.lng)
                : Promise.resolve([]),
        enabled: !!coordinates,
    })

    const handleFindNearest = () => {
        if (!coordinates || !coffeeShops.length) return

        const nearestShop = findNearestCoffee(
            coordinates.lat,
            coordinates.lng,
            coffeeShops
        )

        setNearest(nearestShop)
    }

    return (
        <>
            <FindNearestButton onClick={handleFindNearest} />
            <MapContainer
                center={[55, 37.61]}
                zoom={13}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    attribution='© OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {coffeeShops.map((shop) => (
                    <CoffeeMarker
                        key={shop.id}
                        shop={shop}
                        isHighlighted={nearest?.id === shop.id}
                    />
                ))}

                {coordinates && (
                    <>
                        <UserMarker lat={coordinates.lat} lng={coordinates.lng} />
                        <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />
                    </>
                )}
            </MapContainer>
        </>
    )
}
