export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] bg-gray-800 animate-pulse"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <div className="h-10 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="flex items-center space-x-4">
                <div className="h-5 bg-gray-700 rounded w-16 animate-pulse"></div>
                <div className="h-5 bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-5 bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
              <div className="mt-4">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-700 rounded-lg w-32 animate-pulse"></div>
                  <div className="h-12 bg-gray-700 rounded-lg w-32 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="h-6 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>

            <div>
              <div className="h-6 bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-96 bg-gray-800 rounded-lg border border-gray-700 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex overflow-x-hidden space-x-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
