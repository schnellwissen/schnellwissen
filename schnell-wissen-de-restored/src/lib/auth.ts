import { NextRequest } from 'next/server'

// Admin credentials - in production these should be in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'IboHimoPaul1!'

export interface AdminSession {
  isAuthenticated: boolean
  username?: string
  loginTime?: number
}

// Validate admin credentials
export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

// Create admin session token (simple implementation)
export function createAdminToken(username: string): string {
  const payload = {
    username,
    loginTime: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  
  // In production, use proper JWT with secret key
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// Verify admin token
export function verifyAdminToken(token: string): AdminSession {
  try {
    if (!token || token.trim() === '') {
      return { isAuthenticated: false }
    }

    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Validate payload structure
    if (!payload || typeof payload !== 'object' || !payload.username || !payload.exp) {
      console.warn('Invalid token payload structure')
      return { isAuthenticated: false }
    }
    
    // Check if token is expired
    if (Date.now() > payload.exp) {
      console.warn('Token expired')
      return { isAuthenticated: false }
    }
    
    return {
      isAuthenticated: true,
      username: payload.username,
      loginTime: payload.loginTime
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return { isAuthenticated: false }
  }
}

// Extract admin token from request
export function getAdminTokenFromRequest(request: NextRequest): string | null {
  try {
    // Check cookie first
    const cookieToken = request.cookies.get('admin_token')?.value
    if (cookieToken && cookieToken.trim() !== '') {
      return cookieToken
    }
    
    // Check Authorization header
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      if (token && token.trim() !== '') {
        return token
      }
    }
  } catch (error) {
    console.error('Error extracting token from request:', error)
  }
  
  return null
}

// Check if request is from authenticated admin
export function isAdminAuthenticated(request: NextRequest): AdminSession {
  try {
    const token = getAdminTokenFromRequest(request)
    if (!token) {
      return { isAuthenticated: false }
    }
    
    return verifyAdminToken(token)
  } catch (error) {
    console.error('Admin authentication check error:', error)
    return { isAuthenticated: false }
  }
}

// Generate secure session cookie options
export function getSecureCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/' // Changed from '/dashboard-xy934k2_admin' to '/' for broader access
  }
}