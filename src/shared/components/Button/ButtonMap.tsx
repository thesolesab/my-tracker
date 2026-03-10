import styles from './Button.module.css'

interface Props {
    onClick: () => void,
    text: string,
    style?: object
}

export const ButtonMap = ({ onClick, text, style }: Props) => {
    return (
        <button
            onClick={onClick}
            className={styles.buttonMap}
            style={style}
        >
            {text}
        </button>
    )
}