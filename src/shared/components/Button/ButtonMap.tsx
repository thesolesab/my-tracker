import styles from './Button.module.css'

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface Props {
    onClick: () => void
    text: string
    position?: Position
    disabled?: boolean
    isLoading?: boolean
    style?: object
}

const getPositionStyles = (position: Position = 'top-right'): Record<string, string | number> => {
    const baseStyle = {
        position: 'absolute' as const,
        zIndex: 1000,
        padding: '10px 15px',
    }

    const positionStyles = {
        'top-left': { top: 20, left: 20 },
        'top-right': { top: 20, right: 20 },
        'bottom-left': { bottom: 20, left: 20 },
        'bottom-right': { bottom: 20, right: 20 },
    }

    return { ...baseStyle, ...positionStyles[position] }
}

export const ButtonMap = ({ onClick, text, position = 'top-right', disabled = false, isLoading = false, style }: Props) => {
    const positionStyles = getPositionStyles(position)

    return (
        <button
            onClick={onClick}
            className={styles.buttonMap}
            disabled={disabled || isLoading}
            style={{ ...positionStyles, ...style, opacity: disabled || isLoading ? 0.6 : 1 }}
        >
            {isLoading ? '⏳ Загрузка...' : text}
        </button>
    )
}