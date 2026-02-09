import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const MAX_NAME_LENGTH = 200
const MAX_AREA_LENGTH = 500

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, area, startTime, endTime, timestamp } = body

    // --- Input validation ---
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof area !== 'string' || !area.trim() ||
      typeof startTime !== 'string' || !startTime.trim() ||
      typeof endTime !== 'string' || !endTime.trim()
    ) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 },
      )
    }

    if (name.length > MAX_NAME_LENGTH || area.length > MAX_AREA_LENGTH) {
      return NextResponse.json(
        { error: 'Input too long.' },
        { status: 400 },
      )
    }

    // --- Google Sheets submission ---
    const sheetsUrl = process.env.GOOGLE_SHEETS_URL
    const writeKey = process.env.GOOGLE_SHEETS_WRITE_KEY

    if (sheetsUrl) {
      try {
        const payload: Record<string, string> = {
          name: name.trim(),
          area: area.trim(),
          startTime,
          endTime,
          timestamp: timestamp ?? new Date().toISOString(),
        }
        if (writeKey) {
          payload.writeKey = writeKey
        }

        const response = await fetch(sheetsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          console.error('Google Sheets error:', await response.text())
        }
      } catch (error) {
        console.error('Failed to send to Google Sheets:', error)
      }
    } else {
      console.warn(
        'Google Sheets URL not configured. Set GOOGLE_SHEETS_URL environment variable.',
      )
    }

    // --- Local file fallback (development only) ---
    if (process.env.NODE_ENV === 'development') {
      try {
        const dataDir = path.join(process.cwd(), 'data')
        const filePath = path.join(dataDir, 'submissions.txt')

        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        const line = `${timestamp} | ${name} | ${area} | ${startTime} - ${endTime}\n`
        fs.appendFileSync(filePath, line, 'utf-8')
      } catch (fileError) {
        console.error('Local file save failed:', fileError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 },
    )
  }
}
