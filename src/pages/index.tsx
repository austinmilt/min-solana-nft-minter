import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { UploadForm } from '@/components/UploadForm';

export default function HomePage() {
  return (
    <Layout>
      <Seo />

      <main>
        <section className='bg-slate-900'>
          <div className='layout flex min-h-screen flex-col items-center justify-center space-y-4 text-center'>
            <WalletMultiButton />
            <UploadForm />
            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()} By Austin Milt
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
