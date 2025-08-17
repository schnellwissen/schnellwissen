import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, createAdminToken, getSecureCookieOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // Validate credentials
    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Create admin token
    const token = createAdminToken(username)
    
    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { username }
    })
    
    // Set secure cookie
    const cookieOptions = getSecureCookieOptions()
    response.cookies.set('admin_token', token, cookieOptions)
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}