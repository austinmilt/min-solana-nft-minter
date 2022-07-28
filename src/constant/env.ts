export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

// TODO make configurable in the UI
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
export const METAPLEX_BUNDLER_URL = 'https://devnet.bundlr.network';
