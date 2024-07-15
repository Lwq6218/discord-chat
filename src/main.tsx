import '@/lib/i18n/index';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { SocketProvider } from '@/providers/socket-provider';
import { ThemeProvider } from '@/providers/theme-provider.tsx';
import { AppRouter } from '@/routes';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';

import './index.css';
import './prism.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <AuthProvider>
      <SocketProvider>
        <QueryProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <AppRouter />
        </QueryProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);
