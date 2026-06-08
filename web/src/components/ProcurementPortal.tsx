'use client';
import { useState } from 'react';
import { buildPaymentXDR } from '@/lib/payment';
import { signAndSubmit } from '@/lib/sign';

const CATALOG = [
  { id: 1, name: 'Premium Jasmine Rice (25kg)', price: 45.00, stock: 12, category: 'Grains' },
  { id: 2, name: 'Canned Goods Bulk Pack (24pcs)', price: 18.50, stock: 45, category: 'Canned' },
  { id: 3, name: 'Laundry Detergent Box (5kg)', price: 12.00, stock: 8, category: 'Household' },
  { id: 4, name: 'Instant Noodle Crate (72pcs)', price: 22.00, stock: 20, category: 'Canned' },
];

const XLM_TO_PHP = 8.50; // Mock rate for XLM to PESO
const SUPPLIER_ADDRESS = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'; // Regional Hub Hub

interface ProcurementPortalProps {
  publicKey: string;
  onSent?: () => void;
}

export default function ProcurementPortal({ publicKey, onSent }: ProcurementPortalProps) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  const total = CATALOG.reduce((acc, item) => acc + (item.price * (cart[item.id] || 0)), 0);
  const totalPHP = total * XLM_TO_PHP;

  const handleSubmitOrder = async () => {
    if (total <= 0) return;
    
    try {
      setStatus('submitting');
      setError(null);
      
      const xdr = await buildPaymentXDR(
        publicKey,
        SUPPLIER_ADDRESS,
        total.toFixed(7),
        'XLM'
      );
      
      await signAndSubmit(xdr, publicKey);
      
      setStatus('success');
      setCart({});
      if (onSent) onSent();
    } catch (err: any) {
      console.error('Procurement error:', err);
      setStatus('error');
      
      let msg = err.message || 'Payment failed';
      
      // Improve feedback for common hackathon issues
      if (msg.includes('rejected') || msg.includes('declined')) {
        msg = 'Signing rejected. Please ensure Freighter is set to TESTNET and try again.';
      } else if (msg.includes('FAILED')) {
        msg = 'Transaction failed. This usually means your account is not funded or lacks a trustline.';
      }
      
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="brand text-lg font-extrabold text-text-primary uppercase tracking-tight">Regional Catalog</h2>
          <p className="text-[11px] font-bold text-gold uppercase tracking-widest">Supplier: Regional Hub Central</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Estimated Total</p>
          <p className="brand text-xl font-extrabold text-gold">{total.toFixed(2)} XLM</p>
          <p className="text-[11px] font-bold text-text-muted">≈ ₱{totalPHP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATALOG.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-bg-surface p-5 transition-all hover:border-gold/30 hover:shadow-lg group">
            <div className="flex justify-between items-start mb-3">
              <span className="rounded-full bg-bg-card px-2 py-0.5 text-[10px] font-bold text-text-muted uppercase">{item.category}</span>
              <div className="text-right">
                <p className="text-sm font-bold text-gold brand">{item.price.toFixed(2)} XLM</p>
                <p className="text-[10px] font-medium text-text-muted">₱{(item.price * XLM_TO_PHP).toFixed(2)}</p>
              </div>
            </div>
            <h4 className="font-bold text-text-primary mb-1 brand text-sm">{item.name}</h4>
            <p className="text-[10px] text-text-muted font-medium mb-4">Stock: {item.stock} units available</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => removeFromCart(item.id)}
                  disabled={status === 'submitting' || !(cart[item.id] > 0)}
                  className="h-8 w-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-primary hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-20"
                >
                  -
                </button>
                <span className="text-xs font-bold text-text-secondary w-12 text-center">{cart[item.id] || 0} in cart</span>
                <button 
                  onClick={() => addToCart(item.id)}
                  disabled={status === 'submitting'}
                  className="h-8 w-8 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-primary hover:bg-gold hover:text-bg-primary transition-all disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
          {error}
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 rounded-xl bg-green/10 border border-green/20 text-green text-xs font-medium">
          Order submitted successfully! Supplier notified.
        </div>
      )}

      <button 
        onClick={handleSubmitOrder}
        disabled={total <= 0 || status === 'submitting'}
        className="w-full rounded-xl bg-gold py-4 font-bold text-bg-primary shadow-xl shadow-gold/10 hover:brightness-110 transition-all active:scale-[0.98] uppercase tracking-widest text-sm brand disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Processing Order...' : 'Submit Procurement Order'}
      </button>
    </div>
  );
}
