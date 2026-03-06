import { useCoffeeShopsInView, CoffeeMarker, type CoffeeShop } from "@/entities/coffee-shop"
import { memo, type FC } from "react"
import { findNearestCoffee } from "@/features/find-nearest-coffee"

interface CoffeeShopsLoaderProps {
    onCoffeeSelect: (shop: CoffeeShop) => void
    userPosition: { lat: number; lng: number } | null
}

export const CoffeeShopsLoader: FC<CoffeeShopsLoaderProps> = memo(({ onCoffeeSelect, userPosition }) => {
    const { coffeeShops, isLoading, error } = useCoffeeShopsInView()

    const handleFindNearest = () => {
        if (!userPosition || !coffeeShops.length) return

        const nearestShop = findNearestCoffee(
            userPosition.lat,
            userPosition.lng,
            coffeeShops
        )

        if (nearestShop) {
            onCoffeeSelect(nearestShop)
        }
    }

    if (error) {
        console.error('Coffee shops error:', error)
    }

    return (
        <>
            {userPosition && (
                <button
                    onClick={handleFindNearest}
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
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}
                >
                    🔍 Ближайшее кафе
                </button>
            )}
            {coffeeShops.map((shop) => (
                <CoffeeMarker
                    key={shop.id}
                    shop={shop}
                    onClick={() => onCoffeeSelect(shop)}
                />
            ))}
        </>
    )
})

CoffeeShopsLoader.displayName = 'CoffeeShopsLoader'

