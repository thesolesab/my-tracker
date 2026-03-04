import { useEffect, type FC } from "react"
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { coffeeShopsMock } from "@/entities/coffee-shop/model/mock"
import { CoffeeMarker } from "@/entities/coffee-shop/ui/CoffeeMarker"
import type { CoffeeShop } from "@/entities/coffee-shop/model/types"
import { useGeolocation } from "@/shared/lib/geolocation/useGeolocation"
import { UserMarker } from "@/shared/ui/UserMarker"
import type { GeolocationState } from "@/shared/lib/geolocation/useGeolocation"
import { useMap } from "react-leaflet"

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo([lat, lng], 15)
    }, [lat, lng, map])

    return null
}

export const MapWidget: FC = () => {
    const { coordinates }: GeolocationState = useGeolocation()

    return (
        <MapContainer
            center={[55, 37.61]}
            zoom={13}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {coffeeShopsMock.map((shop: CoffeeShop) => (
                <CoffeeMarker key={shop.id} shop={shop} />
            ))}

            {coordinates && (
                <>
                    <UserMarker lat={coordinates.lat} lng={coordinates.lng} />
                    <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />
                </>
            )}
        </MapContainer>
    )
}
