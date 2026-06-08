'use client';
import { useState } from 'react';
import {
  buildPaymentXDR,
  submitSignedXDR,
  pollTransaction,
  type AssetCode,
} from '@/lib/payment';
import { NETWORK_PASSPHRASE } from '@/lib/stellar';

type Status =
  | 'idle'
  | 'building'
  | 'signing'
  | 'submitting'
  | 'polling'
  | 'success'
  | 'error';

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Authorize Direct Payment',
  building: 'Constructing Payload…',
  signing: 'Awaiting Signature…',
  submitting: 'Broadcasting to Stellar…',
  polling: 'Confirming Finality…',
  success: 'Payment Sent',
  error: 'Retry Authorize',
};

export default function SendPayment({
  publicKey,
  onSent,
}: {
  publicKey: string;
  onSent: () => void;
}) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState<AssetCode>('XLM');
  const [status, setStatus] = useState<Status>('idle');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const busy = ['building', 'signing', 'submitting', 'polling'].includes(status);

  const handleSend = async () => {
    setStatus('building');
    setErrorMsg('');
    setTxHash('');
    try {
      const xdr = await buildPaymentXDR(publicKey, destination.trim(), amount, asset);

      setStatus('signing');
      const freighter = await import('@stellar/freighter-api');
      const signed = await freighter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
        address: publicKey,
      });
      if (signed.error) {
        throw new Error(
          typeof signed.error === 'string' ? signed.error : 'Signing was rejected',
        );
      }

      setStatus('submitting');
      const hash = await submitSignedXDR(signed.signedTxXdr);
      setTxHash(hash);

      setStatus('polling');
      await pollTransaction(hash);
      setStatus('success');
      onSent();
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Payment failed');
      setStatus('error');
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-bg-surface p-8 shadow-xl">
      <h2 className="brand text-lg font-extrabold text-text-primary uppercase tracking-tight mb-6">Direct Supplier Payment</h2>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">Asset Selection</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value as AssetCode)}
            className="w-full rounded-xl bg-bg-card border border-border px-4 py-3 text-sm text-text-primary focus:border-gold/50 outline-none transition-colors"
          >
            <option value="XLM">XLM (Native Asset)</option>
            <option value="USDC">USDC (Stablecoin)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">
            Recipient Supplier Address
          </label>
          <input
            type="text"
            placeholder="G… (Supplier Public Key)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-xl bg-bg-card border border-border px-4 py-3 font-mono text-[11px] text-text-primary focus:border-gold/50 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">Amount to Settle</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl bg-bg-card border border-border px-4 py-3 text-sm text-text-primary focus:border-gold/50 outline-none transition-colors brand font-bold"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={busy || !destination || !amount}
          className="w-full rounded-xl bg-gold py-4 font-bold text-bg-primary shadow-lg shadow-gold/10 hover:brightness-110 transition-all active:scale-[0.98] uppercase tracking-widest text-sm brand"
        >
          {STATUS_LABEL[status]}
        </button>
      </div>

      {status === 'success' && (
        <div className="mt-6 rounded-xl border border-green/20 bg-green/5 p-4">
          <p className="text-sm font-bold text-green mb-1 brand uppercase tracking-tight">Payment Settled</p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[10px] font-mono text-gold hover:underline"
          >
            Proof: {txHash.slice(0, 32)}...
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 rounded-xl border border-red/20 bg-red/5 p-4">
          <p className="text-sm font-medium text-red-400">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
