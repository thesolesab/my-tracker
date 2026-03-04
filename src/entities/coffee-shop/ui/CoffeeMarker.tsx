import { Marker, Popup } from 'react-leaflet'
import type { CoffeeShop } from '../model/types'

interface Props {
    shop: CoffeeShop
}

export const CoffeeMarker = ({ shop }: Props) => {
    return (
        <Marker position={[shop.lat, shop.lng]}>
            <Popup>
                <strong>{shop.name}</strong>
            </Popup>
        </Marker>
    )
}