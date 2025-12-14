import './globals.css'

export const metadata = {
  title: 'Professional Portfolio',
  description: 'Professional portfolio showcasing my work and experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
