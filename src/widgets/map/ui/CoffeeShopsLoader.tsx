import { useCoffeeShopsInView, CoffeeMarker, type CoffeeShop } from "@/entities/coffee-shop"
import { memo, type FC, useCallback } from "react"
import { findNearestCoffee } from "@/features/find-nearest-coffee"
import { ButtonMap } from "@/shared/components/Button"
import { LoadingSpinner } from "@/shared/ui/LoadingSpinner"

interface CoffeeShopsLoaderProps {
    onCoffeeSelect: (shop: CoffeeShop) => void
    userPosition: { lat: number; lng: number } | null
}

export const CoffeeShopsLoader: FC<CoffeeShopsLoaderProps> = memo(({ onCoffeeSelect, userPosition }) => {
    const { coffeeShops, isLoading, error, boundsChanged, setBoundsChanged } = useCoffeeShopsInView()

    const handleFindNearest = useCallback(() => {
        if (!userPosition || !coffeeShops.length) return

        const nearestShop = findNearestCoffee(
            userPosition.lat,
            userPosition.lng,
            coffeeShops
        )

        if (nearestShop) {
            onCoffeeSelect(nearestShop)
        }
    }, [userPosition, coffeeShops, onCoffeeSelect])

    const handleFindInArea = useCallback(() => {
        setBoundsChanged(false)
    }, [setBoundsChanged])

    if (error) {
        console.error('Coffee shops error:', error)
    }

    return (
        <>
            {/* Индикатор загрузки в центре */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 999,
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '20px',
                    borderRadius: '8px',
                }}>
                    <LoadingSpinner size="medium" label="Загружаем кафе..." />
                </div>
            )}

            {/* Кнопка найти ближайшее кафе */}
            {userPosition && (
                <ButtonMap 
                    onClick={handleFindNearest} 
                    text="🔍 Ближайшее кафе" 
                    position="top-right"
                    disabled={!coffeeShops.length}
                    isLoading={isLoading}
                />
            )}

            {/* Кнопка найти кафе в этом районе - показывается при изменении границ */}
            {boundsChanged && !isLoading && (
                <ButtonMap 
                    onClick={handleFindInArea} 
                    text="☕ Найти в этом районе" 
                    position="bottom-right"
                />
            )}

            {/* Маркеры кофеин */}
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

