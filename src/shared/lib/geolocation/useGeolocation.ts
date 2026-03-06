import { useEffect, useState } from 'react'

export interface Coordinates {
    lat: number
    lng: number
}

export interface GeolocationState {
    position: Coordinates | null
    error: string | null
    loading: boolean
}

export const useGeolocation = (): GeolocationState => {
    const isGeolocationSupported = typeof navigator !== 'undefined' && !!navigator.geolocation

    const [error, setError] = useState<null | string>(isGeolocationSupported ? null : `Geolocation isn't supported`)
    const [loading, setLoading] = useState<boolean>(isGeolocationSupported ? true : false)
    const [position, setPosition] = useState<Coordinates | null>(null)

    useEffect(() => {
        if (!isGeolocationSupported) {
            return
        }

        const handleSuccess = (pos: GeolocationPosition) => {
            setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            })

            setLoading(false)
        }
        const handleError = (err: GeolocationPositionError) => {
            setError(err.message)
            setLoading(false)
        }

        const watchId: number = navigator.geolocation.watchPosition(handleSuccess, handleError)

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId)
            }
        }
    }, [isGeolocationSupported])

    return { position, error, loading }
}