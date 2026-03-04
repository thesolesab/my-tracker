import { Marker, Popup } from 'react-leaflet'
import type { CoffeeShop } from '../model/types'
import L from 'leaflet'

const greenIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl:
        'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
})

const defaultIcon = new L.Icon.Default()

interface Props {
    shop: CoffeeShop
    isHighlighted?: boolean
}

export const CoffeeMarker = ({ shop, isHighlighted }: Props) => {
    return (
        <Marker
            position={[shop.lat, shop.lng]}
            icon={isHighlighted ? greenIcon : defaultIcon}
        >
            <Popup>
                <strong>{shop.name}</strong>
            </Popup>
        </Marker>
    )
}