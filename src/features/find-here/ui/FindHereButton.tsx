interface Props {
    onClick: () => void
}

export const FindHereButton = ({ onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            style={{
                position: 'absolute',
                bottom: 20,
                right: '50%',
                zIndex: 1000,
                padding: '10px 15px',
                background: '#111',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
            }}
        >
            Найти ☕ в этом районе
        </button>
    )
}