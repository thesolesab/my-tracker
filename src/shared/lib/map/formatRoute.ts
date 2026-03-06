export const formatDistance = (distance: number) => {
    if (distance < 1000) {
        return `${Math.round(distance)} м`
    }

    return `${(distance / 1000).toFixed(1)} км`
}

export const formatDuration = (duration: number) => {
    const minutes = Math.round(duration / 60)

    return `${minutes} мин`
}