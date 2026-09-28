import HeroBanner from '@/components/home/HeroBanner';
import FeaturedPlaces from '@/components/home/FeaturedPlaces';
import SampleItineraries from '@/components/home/SampleItineraries';

export default function HomePage() {
  return (
    <main className="transition-colors duration-300 pb-20">
      <HeroBanner />
      <FeaturedPlaces />
      <SampleItineraries />
    </main>
  );
}