# 🎨 Гайд по компонентам после рефакторинга

## Компоненты для переиспользования

### 1. ButtonMap - Универсальная кнопка на карте

**Расположение**: `src/shared/components/Button/ButtonMap.tsx`

**Использование**:
```tsx
import { ButtonMap } from '@/shared/components/Button'

// Базовое использование
<ButtonMap 
  onClick={() => console.log('clicked')}
  text="Нажми меня"
/>

// С позиционированием
<ButtonMap 
  onClick={handleFindNearest}
  text="🔍 Ближайшее кафе"
  position="top-right"
/>

// С состоянием загрузки
<ButtonMap 
  onClick={handleSearch}
  text="Поиск кафе"
  position="bottom-right"
  isLoading={isSearching}
  disabled={kaffeeList.length === 0}
/>
```

**Прopsы**:
| Проп | Тип | Default | Описание |
|------|-----|---------|----------|
| onClick | `() => void` | требуется | Обработчик клика |
| text | `string` | требуется | Текст кнопки |
| position | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-right'` | Позиция на экране |
| disabled | `boolean` | `false` | Отключить кнопку |
| isLoading | `boolean` | `false` | Показать индикатор загрузки |
| style | `object` | - | Доп. CSS стили |

---

### 2. LoadingSpinner - Индикатор загрузки

**Расположение**: `src/shared/ui/LoadingSpinner.tsx`

**Использование**:
```tsx
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'

// Базовое использование (средний размер)
<LoadingSpinner />

// Со своим текстом
<LoadingSpinner label="Загружаем кафе..." />

// Большой компонент
<LoadingSpinner size="large" label="Пожалуйста, подождите..." />

// Маленький спиннер
<LoadingSpinner size="small" />
```

**Прopsы**:
| Проп | Тип | Default | Описание |
|---|---|---|---|
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Размер спиннера |
| label | `string` | - | Опциональный текст под спиннером |

**Стили**: Спиннер имеет белый цвет и работает на любом фоне.

---

### 3. useCoffeeShopsInView - Хук для загрузки кафе

**Расположение**: `src/entities/coffee-shop/model/useCoffeeShops.ts`

**Использование**:
```tsx
import { useCoffeeShopsInView } from '@/entities/coffee-shop'

export const MyComponent = () => {
  const { 
    coffeeShops,      // Массив кофеен в текущей области карты
    isLoading,        // true пока загружаются
    error,            // Error объект если ошибка
    boundsChanged,    // true если границы значительно изменились  
    setBoundsChanged  // Функция для сброса флага
  } = useCoffeeShopsInView()

  const handleAreaButton = () => {
    // Пользователь нажал на кнопку "Найти в этом районе"
    setBoundsChanged(false)
    // Кнопка исчезнет
  }

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {boundsChanged && (
        <Button onClick={handleAreaButton}>Найти в этом районе</Button>
      )}
      {coffeeShops.map(shop => (...))}
    </div>
  )
}
```

**Возвращаемое значение**:
```typescript
{
  coffeeShops: CoffeeShop[]   // Кофейни в границах карты
  isLoading: boolean          // Идет загрузка?
  error: Error | null         // Ошибка при загрузке
  boundsChanged: boolean      // Границы сильно изменились?
  setBoundsChanged: (v: boolean) => void  // Функция сброса флага
}
```

---

## 🔄 Миграция старых компонентов

### ✅ Уже сделано

- `FindNearestButton` → использует `ButtonMap` с `position="top-right"`
- `FindHereButton` → использует `ButtonMap` с `position="bottom-right"`
- Состояние загрузки → встроено в `isLoading` проп `ButtonMap`
- Индикатор загрузки → `LoadingSpinner` компонент

### ❌ Удаленные файлы

Если вам нужны старые компоненты, они сохранены в:
- `src/features/find-nearest-coffee/ui/FindNearestButton.tsx`
- `src/features/find-here/ui/FindHereButton.tsx`

Но их использование не рекомендуется, используйте `ButtonMap` вместо них.

---

## 🎯 Примеры использования в проекте

### CoffeeShopsLoader (главный компонент интеграции)

```tsx
// src/widgets/map/ui/CoffeeShopsLoader.tsx
export const CoffeeShopsLoader = memo(({ onCoffeeSelect, userPosition }) => {
  const { coffeeShops, isLoading, boundsChanged, setBoundsChanged } = useCoffeeShopsInView()

  return (
    <>
      {/* Спиннер в центре при загрузке */}
      {isLoading && <LoadingSpinner size="medium" label="Загружаем кафе..." />}

      {/* Кнопка поиска ближайшего - всегда видна */}
      {userPosition && (
        <ButtonMap 
          onClick={handleFindNearest}
          text="🔍 Ближайшее кафе"
          position="top-right"
          disabled={!coffeeShops.length}
          isLoading={isLoading}
        />
      )}

      {/* Кнопка "найти в районе" - появляется при изменении границ */}
      {boundsChanged && !isLoading && (
        <ButtonMap 
          onClick={() => setBoundsChanged(false)}
          text="☕ Найти в этом районе"
          position="bottom-right"
        />
      )}

      {/* Маркеры кофеин */}
      {coffeeShops.map(shop => (...))}
    </>
  )
})
```

---

## 📝 Подсказки

1. **Позиционирование кнопки**: Используйте `position` проп вместо передачи `style={{ top: 20, right: 20 }}`

2. **Состояние загрузки**: Всегда показывайте `isLoading` состояние, чтобы пользователь знал, что происходит

3. **Сброс флага**: После обработки `boundsChanged` не забудьте вызвать `setBoundsChanged(false)`

4. **Кэширование**: Запросы кафеин кэшируются на 10 минут, поэтому повторный запрос в тот же район будет мгновенным

5. **Debounce**: Исходящие запросы при движении карты дебаунсятся на 1.5 секунды для оптимизации

---

## 🐜 Отправка ошибок/Улучшения

Если вы заметили ошибку в компонентах:

1. Проверьте пример выше
2. Убедитесь, что вы передаёте все требуемые пропсы
3. Посмотрите консоль браузера на ошибки
4. Проверьте, что импорт правильный: `@/shared/components/Button` и `@/shared/ui/LoadingSpinner`
