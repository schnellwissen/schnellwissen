export default function Loading() {
  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="card p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            
            <div className="space-y-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded w-32"></div>
                  <div className="h-12 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}