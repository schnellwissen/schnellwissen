import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = (process.env.ALLOWED_IMAGE_HOSTS || 'images.pexels.com,picsum.photos,*.supabase.co')
  .split(',')
  .map(h => h.trim());

const MAX_BYTES = parseInt(process.env.IMAGE_PROXY_MAX_BYTES || '5242880', 10); // 5MB
const FALLBACK_COVER_URL = process.env.FALLBACK_COVER_URL || 
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

function isHostAllowed(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    return ALLOWED_HOSTS.some(allowedHost => {
      if (allowedHost.startsWith('*.')) {
        const domain = allowedHost.slice(2);
        return hostname === domain || hostname.endsWith('.' + domain);
      }
      return hostname === allowedHost;
    });
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('u');
  const kind = searchParams.get('kind') || 'image';

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  // Check if host is allowed
  if (!isHostAllowed(imageUrl)) {
    console.warn('Blocked image request to:', imageUrl);
    // Return fallback for covers, error for others
    if (kind === 'cover') {
      return new NextResponse(null, {
        status: 302,
        headers: { Location: FALLBACK_COVER_URL }
      });
    }
    return new NextResponse('Host not allowed', { status: 403 });
  }

  try {
    // Fetch the image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsPortal/1.0)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('Not an image');
    }

    // Check content length
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BYTES) {
      throw new Error('Image too large');
    }

    // Stream the response
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 24 hours
        'X-Proxy-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Return fallback for covers, error for others
    if (kind === 'cover') {
      return new NextResponse(null, {
        status: 302,
        headers: { Location: FALLBACK_COVER_URL }
      });
    }
    
    return new NextResponse('Image fetch failed', { status: 500 });
  }
}