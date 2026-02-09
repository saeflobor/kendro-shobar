import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Try to get count from Google Sheets (primary source)
    const sheetsUrl = process.env.GOOGLE_SHEETS_URL
    if (sheetsUrl) {
      try {
        const response = await fetch(sheetsUrl, {
          method: 'GET',
          next: { revalidate: 30 }, // Cache for 30 seconds
        })

        if (response.ok) {
          const data = await response.json()
          if (typeof data.count === 'number') {
            return NextResponse.json({ count: data.count })
          }
        }
      } catch (error) {
        console.error('Failed to get count from Google Sheets:', error)
      }
    }

    // Fallback: count lines in local file (development only)
    if (process.env.NODE_ENV === 'development') {
      try {
        const filePath = path.join(process.cwd(), 'data', 'submissions.txt')
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8')
          const lines = content.trim().split('\n').filter(Boolean)
          return NextResponse.json({ count: lines.length })
        }
      } catch {
        // File doesn't exist yet
      }
    }

    return NextResponse.json({ count: 0 })
  } catch (error) {
    console.error('Error getting count:', error)
    return NextResponse.json({ count: 0 })
  }
}
