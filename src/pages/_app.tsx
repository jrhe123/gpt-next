import '@/styles/globals.css'
import { useState } from 'react'
import type { AppProps } from 'next/app'

import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme
} from '@mantine/core'

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark')
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || colorScheme === 'dark' ? 'dark' : 'light')
  }

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <Component {...pageProps} />
    </ColorSchemeProvider>
  )
}
