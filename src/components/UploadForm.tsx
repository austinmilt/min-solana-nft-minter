import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useCallback, useState } from 'react';

import { useCreateNFT } from '@/lib/nft';

import Button from '@/components/buttons/Button';
import PrimaryLink from '@/components/links/PrimaryLink';

import { SOLANA_RPC_URL } from '@/constant/env';

export function UploadForm(): JSX.Element {
  const wallet: WalletContextState = useWallet();
  const mintContext = useCreateNFT(wallet);
  const [nftName, setNftName] = useState<string>('');
  const [nftSymbol, setNftSymbol] = useState<string>('');
  const [sellerFeeBasisPoints, setSellerFeeBasisPoints] = useState<number>(500);
  const [file, setFile] = useState<File | undefined>();

  const onFileUpload = useCallback((input: HTMLInputElement) => {
    const files = input.files;
    if (!files || files.length !== 1) {
      alert('Must select one image.');
      return;
    }
    setFile(files[0]);
  }, []);

  const onChangeFee = useCallback((v: number) => {
    if (v >= 0 && v <= 10000) {
      setSellerFeeBasisPoints(v);
    }
  }, []);

  const onSubmit = useCallback(() => {
    if (!file) {
      alert('Must select one image.');
      return;
    }
    mintContext.run({
      name: nftName,
      symbol: nftSymbol,
      image: file,
      fee: sellerFeeBasisPoints,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintContext.run, file]);

  const viewNftLink = `https://explorer.solana.com/address/${
    mintContext.data?.nft.mintAddress
  }?cluster=custom&customUrl=${encodeURIComponent(SOLANA_RPC_URL)}`;

  return (
    <form className='flex flex-col items-center justify-center space-y-4 text-center'>
      <div className='flex flex-row items-center justify-center space-x-4'>
        <label htmlFor='nft-name' className='text-white'>
          Name
        </label>
        <input
          type='text'
          id='nft-name'
          onChange={(e) => setNftName(e.currentTarget.value)}
          required
        />
      </div>
      <div className='flex flex-row items-center justify-center space-x-4'>
        <label htmlFor='nft-symbol' className='text-white'>
          Symbol
        </label>
        <input
          type='text'
          id='nft-symbol'
          onChange={(e) => setNftSymbol(e.currentTarget.value)}
          required
        />
      </div>
      <div className='flex flex-row items-center justify-center space-x-4'>
        <label htmlFor='nft-fee-basis' className='text-white'>
          Seller Fee Basis Points (
          {`${(sellerFeeBasisPoints / 100).toFixed(2)}%`})
        </label>
        <input
          type='number'
          min={0}
          max={10000}
          step={1}
          id='nft-fee-basis'
          value={sellerFeeBasisPoints}
          onChange={(e) => onChangeFee(e.currentTarget.valueAsNumber)}
          required
        />
      </div>
      <Button>
        <label htmlFor='nft-upload'>Choose NFT Image</label>
        <input
          type='file'
          className='hidden bg-slate-700 text-white'
          id='nft-upload'
          onChange={(e) => onFileUpload(e.currentTarget)}
        />
      </Button>
      {file && <span className='text-white'>{file.name}</span>}
      <Button
        variant='primary'
        isLoading={mintContext.loading}
        onClick={onSubmit}
      >
        Mint NFT
      </Button>
      {!mintContext.loading && mintContext.data && (
        <PrimaryLink href={viewNftLink}>View on Solana Explorer</PrimaryLink>
      )}
      {mintContext.error && (
        <>
          <span className='text-red-200'>Error</span>
          <code className='text-red-200'>{mintContext.error.message}</code>
        </>
      )}
    </form>
  );
}
