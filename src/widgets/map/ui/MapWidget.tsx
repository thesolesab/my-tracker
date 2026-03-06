import { useEffect, useState, type FC } from "react"
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useGeolocation } from "@/shared/lib/geolocation/useGeolocation"
import { UserMarker } from "@/shared/ui/UserMarker"
import type { GeolocationState } from "@/shared/lib/geolocation/useGeolocation"
import { useMap } from "react-leaflet"
import { formatDistance, formatDuration } from "@/shared/lib/map/formatRoute"
import { CoffeeMarker, useCoffeeShopsInView, type CoffeeShop } from "@/entities/coffee-shop"
import { RouteInfo, RouteLine, useRoute } from "@/features/build-route"
// import { FindNearestButton, findNearestCoffee } from "@/features/find-nearest-coffee"

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo([lat, lng], 15)
    }, [lat, lng, map])

    return null
}

export const MapWidget: FC = () => {
    const { position }: GeolocationState = useGeolocation()
    const [selectedCoffee, setSelectedCoffee] = useState<CoffeeShop | null>(null)

    const { coffeeShops } = useCoffeeShopsInView()


    // const handleFindNearest = () => {
    //     if (!position || !coffeeShops.length) return

    //     const nearestShop = findNearestCoffee(
    //         position.lat,
    //         position.lng,
    //         coffeeShops
    //     )

    //     setSelectedCoffee(nearestShop)
    // }

    const { data: route } = useRoute(
        position ? [position.lat, position.lng] : null,
        selectedCoffee ? [selectedCoffee.lat, selectedCoffee.lng] : null
    )


    return (
        <>
            {/* <FindNearestButton onClick={handleFindNearest} /> */}
            <MapContainer
                center={[56.3, 37.61]}
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
                        onClick={() => setSelectedCoffee(shop)}
                    />
                ))}

                {position && (
                    <>
                        <UserMarker lat={position.lat} lng={position.lng} />
                        <RecenterMap lat={position.lat} lng={position.lng} />
                    </>
                )}

                {
                    route && <>
                        <RouteLine route={route.coordinates} />
                        <RouteInfo
                            distance={route.distance}
                            duration={route.duration}
                            formatDistance={formatDistance}
                            formatDuration={formatDuration}
                        />
                    </>
                }
            </MapContainer>
        </>
    )
}
