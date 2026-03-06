import { useQuery } from "@tanstack/react-query"
import { fetchRoute } from "../api/routeApi"

export const useRoute = (
    start: [number, number] | null,
    end: [number, number] | null
) => {
    return useQuery({
        queryKey: ['route', start, end],
        queryFn: () => fetchRoute(start!, end!),
        enabled: !!start && !!end
    })
}