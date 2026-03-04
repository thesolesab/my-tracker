interface Props {
    onClick: () => void
}

export const FindNearestButton = ({ onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 1000,
                padding: '10px 15px',
                background: '#111',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
            }}
        >
            Найти ближайшую ☕
        </button>
    )
}