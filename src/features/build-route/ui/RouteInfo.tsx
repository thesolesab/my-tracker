import styles from './RouteInfo.module.css' // <-- импорт CSS-модуля

interface Props {
    distance: number
    duration: number
    formatDistance: (d: number) => string
    formatDuration: (d: number) => string
}

export const RouteInfo = ({ distance, duration, formatDistance, formatDuration }: Props) => {
    return (
        <div className={styles.routeInfo}>
            🚶 {formatDuration(duration)} • 📏 {formatDistance(distance)}
        </div>
    )
}