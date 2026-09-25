import HeroBanner from '@/components/home/HeroBanner';
import FeaturedPlaces from '@/components/home/FeaturedPlaces';
import SampleItineraries from '@/components/home/SampleItineraries';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <main className="min-h-screen transition-colors duration-300 pb-20">
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>
      <HeroBanner />
      <FeaturedPlaces />
      <SampleItineraries />
    </main>
  );
}