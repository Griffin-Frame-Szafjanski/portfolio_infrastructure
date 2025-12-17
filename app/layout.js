import './globals.css'
import { ThemeProvider } from './context/ThemeContext'

export const metadata = {
  title: 'Portfolio',
  description: 'Professional Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
