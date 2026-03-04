import { Marker, Popup } from 'react-leaflet'

interface Props {
    lat: number
    lng: number
}

export const UserMarker = ({ lat, lng }: Props) => {
    return (
        <Marker position={[lat, lng]}>
            <Popup>Вы здесь</Popup>
        </Marker>
    )
}