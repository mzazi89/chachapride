import './globals.css'
import { RideProvider } from './context/RideContext'
import { AuthProvider } from './context/AuthContext'
import Footer from './components/Footer'
import RegisterSW from './components/RegisterSW'

export const metadata = {
  title: 'chachapride - Go anywhere',
  description: 'Safe, affordable ride-hailing in Kenya — book, pay, and track your driver in real time.',
  applicationName: 'chachapride',
  appleWebApp: {
    capable: true,
    title: 'chachapride',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'chachapride - Go anywhere',
    description: 'Safe, affordable ride-hailing in Kenya — book, pay, and track your driver in real time.',
    type: 'website',
    siteName: 'chachapride',
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
        <RegisterSW />
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
