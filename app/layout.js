import './globals.css'
import { RideProvider } from './context/RideContext'

export const metadata = {
  title: 'Uber - Go anywhere',
  description: 'Request a ride, get affordable options instantly',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <RideProvider>
          {children}
        </RideProvider>
      </body>
    </html>
  )
}
