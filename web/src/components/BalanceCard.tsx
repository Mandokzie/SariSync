'use client';
import { useState, useEffect } from 'react';
import { fetchBalances, type Balances } from '@/lib/balances';

export default function BalanceCard({
  publicKey,
  refreshKey,
}: {
  publicKey: string;
  refreshKey: number;
}) {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBalances(publicKey)
      .then((b) => active && setBalances(b))
      .catch(() => active && setBalances(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [publicKey, refreshKey]);

  if (loading) {
    return (
      <div className="mt-4 grid animate-pulse grid-cols-2 gap-4">
        <div className="h-20 rounded bg-bg-card border border-border" />
        <div className="h-20 rounded bg-bg-card border border-border" />
      </div>
    );
  }

  if (balances && !balances.funded) {
    return (
      <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-gold">
        <p className="font-bold mb-1">Account not funded</p>
        <p className="text-xs opacity-80">Click “Fund with Friendbot” to receive testnet XLM.</p>
      </div>
    );
  }

  if (!balances) {
    return <p className="mt-4 text-sm text-red-400">Failed to load balances.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-bg-surface p-5 transition-colors hover:border-gold/30">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">XLM Balance</p>
        <p className="brand text-xl font-extrabold text-text-primary">{balances.xlm}</p>
      </div>
      <div className="rounded-xl border border-border bg-bg-surface p-5 transition-colors hover:border-gold/30">
        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">USDC Balance</p>
        <p className="brand text-xl font-extrabold text-gold">{balances.usdc}</p>
      </div>
    </div>
  );
}
