import { useEffect, useState } from 'react';
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { SOLANA_CONFIG } from '../config/solana';

export const useSolanaTransactions = (contractAddress: string) => {
  const [isBuyTransaction, setIsBuyTransaction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  const isPumpFunInteraction = (tx: ParsedTransactionWithMeta | null) => {
    if (!tx?.meta?.logMessages) return false;
    
    // Check for any interaction with the contract address
    const hasContractInteraction = tx.meta.logMessages.some(log => 
      log.includes(contractAddress) || 
      log.includes('Program invoke') ||
      log.includes('Transfer') ||
      log.includes('Buy')
    );

    console.log('Transaction logs:', tx.meta.logMessages);
    return hasContractInteraction;
  };

  useEffect(() => {
    console.log('Initializing contract monitoring...');
    
    if (!contractAddress) {
      setError('Contract address is required');
      return;
    }

    const rpcUrl = `${SOLANA_CONFIG.RPC_ENDPOINT}/?api-key=${SOLANA_CONFIG.API_KEY}`;
    const connection = new Connection(rpcUrl, {
      commitment: SOLANA_CONFIG.COMMITMENT
    });

    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(contractAddress);
      console.log('Monitoring contract:', contractAddress);
      setIsConnected(true);
    } catch (err) {
      setError('Invalid contract address');
      setIsConnected(false);
      return;
    }

    let lastSignature: string | null = null;

    const checkTransactions = async () => {
      try {
        const signatures = await connection.getSignaturesForAddress(
          publicKey,
          { limit: 1 },
          SOLANA_CONFIG.COMMITMENT
        );

        console.log('Found signatures:', signatures);

        if (signatures.length > 0) {
          const latestSignature = signatures[0].signature;
          console.log('Latest signature:', latestSignature);
          
          if (latestSignature !== lastSignature) {
            const tx = await connection.getParsedTransaction(latestSignature, {
              maxSupportedTransactionVersion: 0
            });
            
            console.log('Transaction details:', tx);
            
            if (isPumpFunInteraction(tx)) {
              setIsBuyTransaction(true);
              setLastTransaction(latestSignature);
              setTimeout(() => setIsBuyTransaction(false), 3000);
            }
          }
        }
      } catch (err) {
        console.error('Transaction check error:', err);
      }
    };

    const interval = setInterval(checkTransactions, SOLANA_CONFIG.REFRESH_INTERVAL);
    checkTransactions();

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [contractAddress]);

  return { isBuyTransaction, error, isConnected, lastTransaction };
};