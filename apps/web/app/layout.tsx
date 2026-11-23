import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from 'sonner';
import 'katex/dist/katex.min.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HYPERMIND AI — Universal Intelligence Platform',
  description:
    'One Platform. Multiple Intelligence. Infinite Possibilities. Chat, Research, Code, Create, and Automate with the world\'s most advanced AI models.',
  keywords: ['AI', 'ChatGPT', 'Claude', 'Gemini', 'AI Platform', 'HYPERMIND'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen font-sans theme-transition">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={[
            'dark',
            'light',
            'deep-space',
            'cyber-purple',
            'ocean-blue',
            'cinematic-black',
            'custom',
          ]}
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-card text-card-foreground border-border',
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
