'use client';

export default function CoverTest() {
  const testImages = [
    'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg',
    'https://picsum.photos/800/600?random=1',
    'https://invalid-domain.com/image.jpg', // Should fallback
    'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug: Cover Image Test</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Testing image proxy with whitelist. Allowed hosts: images.pexels.com, picsum.photos, *.supabase.co
        </p>
      </div>

      <div className="grid gap-6">
        {testImages.map((url, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-medium mb-2">Test Image {index + 1}</h3>
            <p className="text-sm text-gray-600 mb-3 break-all">
              Original URL: {url}
            </p>
            <p className="text-sm text-gray-600 mb-3 break-all">
              Proxy URL: /api/img?u={encodeURIComponent(url)}&kind=cover
            </p>
            
            <div className="max-w-md">
              <img
                src={`/api/img?u=${encodeURIComponent(url)}&kind=cover`}
                alt={`Test ${index + 1}`}
                className="w-full rounded shadow"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.border = '2px solid red';
                  target.alt = 'Failed to load';
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.border = '2px solid green';
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Expected Behavior</h2>
        <ul className="text-sm space-y-1">
          <li>✅ Images from pexels.com and picsum.photos should load with green border</li>
          <li>⚠️ Images from invalid-domain.com should fallback (transparent pixel)</li>
          <li>🔒 Proxy protects against SSRF by whitelisting hosts</li>
          <li>⏱️ 10 second timeout prevents hanging requests</li>
        </ul>
      </div>
    </div>
  );
}