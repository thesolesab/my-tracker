import { useEffect, useState, type FC } from "react"
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useGeolocation } from "@/shared/lib/geolocation/useGeolocation"
import { UserMarker } from "@/shared/ui/UserMarker"
import type { GeolocationState } from "@/shared/lib/geolocation/useGeolocation"
import { useMap } from "react-leaflet"
import { formatDistance, formatDuration } from "@/shared/lib/map/formatRoute"
import type { CoffeeShop } from "@/entities/coffee-shop"
import { RouteInfo, RouteLine, useRoute } from "@/features/build-route"
import { CoffeeShopsLoader } from "./CoffeeShopsLoader"

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

    const { data: route } = useRoute(
        position ? [position.lat, position.lng] : null,
        selectedCoffee ? [selectedCoffee.lat, selectedCoffee.lng] : null
    )

    return (
        <>
            <MapContainer
                center={[56.3, 37.61]}
                zoom={13}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    attribution='© OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <CoffeeShopsLoader 
                    onCoffeeSelect={setSelectedCoffee}
                    userPosition={position}
                />

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
