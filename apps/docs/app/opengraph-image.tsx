import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'Tesserix Design System - Cross-platform UI Components'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            Tesserix Design System
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px',
              maxWidth: '900px',
            }}
          >
            Cross-platform UI components for web and React Native
          </p>
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <span>123+ Components</span>
            <span>•</span>
            <span>23 Themes</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
