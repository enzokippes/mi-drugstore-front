export default function ProductSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-800 rounded w-16" />
          <div className="h-8 bg-gray-800 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
