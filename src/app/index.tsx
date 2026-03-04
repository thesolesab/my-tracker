import { MapPage } from '@/pages/map-page'
import { QueryProvider } from './providers/query-provider'

export const App = () => {
    return (
        <QueryProvider>
            <MapPage />
        </QueryProvider>
    )
}