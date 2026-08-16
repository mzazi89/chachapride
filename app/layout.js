import './globals.css'
import { RideProvider } from './context/RideContext'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'

export const metadata = {
  title: 'chachapride - Go anywhere',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          <RideProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </RideProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
