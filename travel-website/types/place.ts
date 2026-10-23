export interface Place {
    id: string | number;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    image?: string;
    district?: string;
    ward?: string;
    rating?: number;
    lat: number;
    lng: number;
    category: string;
    price: string;
    openTime?: string;
    experience?: string;
    province?: number;
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