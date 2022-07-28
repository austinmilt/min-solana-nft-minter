import {
  bundlrStorage,
  CreateNftOutput,
  Metaplex,
  Nft,
  Signer,
  toMetaplexFileFromBrowser,
  UploadMetadataOutput,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useCallback, useMemo, useState } from 'react';

import { METAPLEX_BUNDLER_URL, SOLANA_RPC_URL } from '@/constant/env';

export interface QueryContext<T, U> {
  data?: U;
  loading: boolean;
  error?: Error;
  run: (args: T) => void;
}

export function useConnection(): Connection {
  return useMemo(() => new Connection(SOLANA_RPC_URL), []);
}

export function useMetaplex(): Metaplex {
  const connection = useConnection();
  return useMemo(
    () => new Metaplex(connection, { cluster: 'custom' }),
    [connection]
  );
}

export interface CreateNFTRequest {
  name: string;
  symbol: string;
  image: File;
  fee: number;
}

export interface CreateNFTData extends CreateNftOutput {
  nft: Nft;
}

export function useCreateNFT(
  wallet: WalletContextState
): QueryContext<CreateNFTRequest, CreateNFTData> {
  const metaplex = useMetaplex();
  const [data, setData] = useState<CreateNFTData | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const run: (req: CreateNFTRequest) => void = useCallback(
    (req) => {
      const asyncRun = async () => {
        setLoading(true);
        setError(undefined);
        setData(undefined);

        try {
          const signer: Signer = asSigner(wallet);
          const uploadResult: UploadMetadataOutput = await metaplex
            .use(
              bundlrStorage({
                address: METAPLEX_BUNDLER_URL,
                providerUrl: SOLANA_RPC_URL,
                timeout: 60000,
              })
            )
            .use(walletAdapterIdentity(wallet))
            .nfts()
            .uploadMetadata({
              name: req.name,
              image: await toMetaplexFileFromBrowser(req.image),
              symbol: req.symbol,
              properties: {},
            })
            .run();

          const mintResult: CreateNFTData = await metaplex
            .use(walletAdapterIdentity(wallet))
            .nfts()
            .create({
              uri: uploadResult.uri,
              name: req.name,
              sellerFeeBasisPoints: req.fee,
              symbol: req.symbol,
              payer: signer,
              owner: signer.publicKey,
              updateAuthority: signer,
            })
            .run();

          setData(mintResult);
        } catch (e) {
          setError(e as unknown as Error);
        } finally {
          setLoading(false);
        }
      };
      asyncRun();
    },
    [metaplex, wallet]
  );

  return { data, loading, error, run };
}

function asSigner(wallet: WalletContextState): Signer {
  if (wallet.publicKey == null) {
    throw new Error('Connect wallet.');
  }
  if (wallet.signMessage == null) {
    throw new Error('Not able to sign messages with this wallet.');
  }
  if (wallet.signTransaction == null || wallet.signAllTransactions == null) {
    throw new Error('Not able to sign transactions with this wallet.');
  }
  return wallet as Signer;
}
