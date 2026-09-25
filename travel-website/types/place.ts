export interface Place {
    id: string;
    name: string;
    slug: string;
    image: string;
    district: string;
    ward: string;
    rating: number;
    description: string;
    lat: number;
    lng: number;
}
export interface Itinerary {
    id: string;
    title: string;
    duration: string;
    distance: string;
    stopsCount: number;
    description: string;
    highlights: string[];
}   