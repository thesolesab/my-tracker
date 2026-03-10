import styles from './LoadingSpinner.module.css'

interface Props {
    size?: 'small' | 'medium' | 'large'
    label?: string
}

export const LoadingSpinner = ({ size = 'medium', label }: Props) => {
    return (
        <div className={`${styles.spinner} ${styles[size]}`}>
            <div className={styles.circle}></div>
            {label && <p className={styles.label}>{label}</p>}
        </div>
    )
}
