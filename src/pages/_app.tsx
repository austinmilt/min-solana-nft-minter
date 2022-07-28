import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { WalletProvider } from '@/components/WalletProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
