import { Marker, Popup } from 'react-leaflet'
import { redIcon } from '../config/leaflet'

interface Props {
    lat: number
    lng: number
}

export const UserMarker = ({ lat, lng }: Props) => {
    return (
        <Marker position={[lat, lng]} icon={redIcon}>
            <Popup>Вы здесь</Popup>
        </Marker>
    )
}