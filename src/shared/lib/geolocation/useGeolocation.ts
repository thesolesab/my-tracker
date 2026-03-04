import { useEffect, useState } from 'react'

export interface Coordinates {
    lat: number
    lng: number
}

export interface GeolocationState {
    coordinates: Coordinates | null
    error: string | null
    loading: boolean
}

export const useGeolocation = (): GeolocationState => {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported')
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                })
                setLoading(false)
            },
            () => {
                setError('Permission denied or unavailable')
                setLoading(false)
            }
        )
    }, [])

    return { coordinates, error, loading }
}