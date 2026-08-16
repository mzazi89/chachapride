export const metadata = {
  title: 'Uber - Go anywhere',
  description: 'Request a ride, get affordable options',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
