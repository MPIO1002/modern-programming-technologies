import PlaceCardSkeleton from "./PlaceCardSkeleton";

export default function PlaceGridSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }, (_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  );
}
