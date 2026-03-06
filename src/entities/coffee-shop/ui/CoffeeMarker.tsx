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
    onClick?: () => void
}

export const CoffeeMarker = ({ shop, isHighlighted, onClick }: Props) => {
    return (
        <Marker
            position={[shop.lat, shop.lng]}
            icon={isHighlighted ? greenIcon : defaultIcon}
            eventHandlers={{ click: onClick }}
        >
            <Popup>
                <strong>{shop.name}</strong>
                <br />
                <button onClick={onClick}>Построить маршрут</button>
            </Popup>
        </Marker>
    )
}