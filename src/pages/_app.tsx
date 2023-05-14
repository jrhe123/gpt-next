import '@/styles/globals.css'
import { useState } from 'react'
import type { AppProps } from 'next/app'
// libs
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
// error boundary handles
import ErrorBoundary from '../components/errorBoundary'

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || colorScheme === 'dark' ? 'dark' : 'light')
  }

  return (
    <ErrorBoundary>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            colorScheme,
            primaryColor: 'green'
          }}
          withNormalizeCSS
          withGlobalStyles
        >
          {/* main entry */}
          <Component {...pageProps} />
          {/* notifications component */}
          <Notifications position="top-right" zIndex={999} />
        </MantineProvider>
      </ColorSchemeProvider>
    </ErrorBoundary>
  )
}
