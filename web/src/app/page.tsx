'use client';
import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import ConnectWallet from '@/components/ConnectWallet';
import FundAccount from '@/components/FundAccount';
import AddTrustline from '@/components/AddTrustline';
import BalanceCard from '@/components/BalanceCard';
import SendPayment from '@/components/SendPayment';
import ProcurementPortal from '@/components/ProcurementPortal';

export default function Home() {
  const wallet = useWallet();
  const { publicKey, connecting } = wallet;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const [scrolled, setScrolled] = useState(false);

  // Scroll visibility observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-reveal, .stagger-reveal').forEach((el) => {
      observer.observe(el);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-sans">
      {/* 1. NAVIGATION */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-bg-primary/80 backdrop-blur-md border-b border-border py-2' : 'bg-transparent py-4'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-gold font-bold text-bg-primary shadow-lg">
              S
            </div>
            <div className="flex flex-col">
              <span className="brand text-xl font-extrabold tracking-tight text-gold leading-none">SARISYNC</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-0.5">B2B PROCUREMENT</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {['Features', 'How It Works', 'For Stores', 'For Suppliers', 'Pricing'].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-text-secondary hover:text-gold transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-bg-surface px-3 py-1.5 text-[11px] font-bold text-text-secondary border border-border">
              <span className="h-2 w-2 rounded-full bg-green animate-pulse pulse-green"></span>
              SUPPLIER NETWORK LIVE
            </div>
            <ConnectWallet {...wallet} />
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4A90E2 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/5 scroll-reveal">
            <h1 className="brand text-4xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tighter mb-8">
              The Supply Chain<br/>
              Every Sari-Sari<br/>
              <span className="text-gold">Store Deserves.</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-xl mb-10 leading-relaxed font-light">
              Sari-sari stores are trapped in local supplier networks. SariSync connects them to 
              regional distributors via Stellar-powered USDC payments. Zero fees. 5-second settlement.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-16">
              <button 
                onClick={() => document.getElementById('for-stores')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gold text-bg-primary px-8 py-4 rounded-md font-bold text-base sm:text-lg hover:brightness-110 transition-all shadow-xl shadow-gold/10"
              >
                Start Ordering
              </button>
              <button 
                onClick={() => alert('Supplier registration coming soon!')}
                className="border border-border text-text-primary px-8 py-4 rounded-md font-bold text-base sm:text-lg hover:bg-white/5 transition-all"
              >
                For Suppliers →
              </button>
            </div>

            <div className="flex flex-wrap gap-8 py-8 border-t border-border">
              {[
                { label: '₱0 Transaction Fees', icon: '💸' },
                { label: '5-Second Settlement', icon: '⚡' },
                { label: '500+ SKUs Available', icon: '📦' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/5 w-full scroll-reveal">
             <div className="bg-bg-surface rounded-2xl border border-border p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6">
                   <span className="font-bold text-[11px] uppercase tracking-widest text-text-muted">Supplier Catalog</span>
                   <span className="bg-green/20 text-green px-2 py-1 rounded text-[10px] font-bold">LIVE</span>
                </div>
                <div className="space-y-4">
                   {[
                      { name: 'Puregold Regional Hub', item: 'USDC-PHP Stable', price: '1.00', img: 'bg-gold/20' },
                      { name: 'SMC Distributor', item: 'USDC-PHP Stable', price: '1.00', img: 'bg-blue/20' }
                   ].map((item, i) => (
                      <div key={i} className="bg-bg-card rounded-xl p-4 border border-border flex items-center gap-4">
                         <div className={`h-12 w-12 rounded-lg ${item.img}`}></div>
                         <div className="flex-1">
                            <h4 className="font-bold text-sm brand">{item.name}</h4>
                            <p className="text-[10px] text-text-muted">{item.item}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-gold text-sm brand">{item.price}</p>
                            <p className="text-[8px] text-text-muted">USDC</p>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full bg-border border-2 border-bg-surface"></div>)}
                   </div>
                   <span className="text-[10px] text-text-muted font-bold">12k+ Stores Connected</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM STATEMENT SECTION */}
      <section id="features" className="py-24 bg-bg-surface border-y border-border">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 scroll-reveal">
               <span className="text-gold font-bold text-[11px] uppercase tracking-[0.4em] mb-4 block">THE PROBLEM</span>
               <h2 className="brand text-3xl sm:text-4xl lg:text-5xl font-extrabold">Local suppliers. Local limits.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-reveal">
               {[
                  { icon: '🗺', title: 'Trapped in 1km radius', desc: 'Can only buy from whoever walks into the barangay. No regional access.' },
                  { icon: '💸', title: 'Cash-only, no records', desc: 'No purchase history, no credit building, no receipts. Financial invisibility.' },
                  { icon: '📦', title: 'Stockouts hurt sales', desc: 'No visibility into regional stock or advance ordering. Lost customers every day.' }
               ].map((pain, i) => (
                  <div key={i} className="bg-bg-card p-10 rounded-2xl border border-border hover:border-gold/50 transition-colors group">
                     <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform">{pain.icon}</span>
                     <h3 className="brand text-xl font-bold mb-4">{pain.title}</h3>
                     <p className="text-base text-text-secondary leading-relaxed font-light">{pain.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 scroll-reveal">
               <span className="text-gold font-bold text-[11px] uppercase tracking-[0.4em] mb-4 block">HOW IT WORKS</span>
               <h2 className="brand text-3xl sm:text-4xl lg:text-5xl font-extrabold">Order. Pay. Receive. On-chain.</h2>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between gap-12 stagger-reveal">
               <div className="absolute top-10 left-12 right-12 h-0.5 bg-border hidden md:block"></div>
               {[
                  { n: '1', title: 'Browse', desc: 'Store owner browses regional supplier catalog filtered by category and location.' },
                  { n: '2', title: 'Order', desc: 'Add bulk items to cart; see live USDC pricing updated in real-time.' },
                  { n: '3', title: 'Pay', desc: 'Send USDC directly to supplier via Stellar. Zero fees. Confirms in 5 seconds.' },
                  { n: '4', title: 'Receive', desc: 'Supplier delivers and marks order fulfilled on-chain. Immutable receipt.' }
               ].map((step, i) => (
                  <div key={i} className="relative z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                     <div className="h-12 w-12 rounded-full bg-bg-card border-2 border-gold flex items-center justify-center font-bold text-gold text-xl mb-8 shadow-[0_0_20px_rgba(245,197,66,0.2)]">
                        {step.n}
                     </div>
                     <h3 className="brand text-xl font-bold mb-4 text-text-primary">{step.title}</h3>
                     <p className="text-sm text-text-secondary leading-relaxed font-light">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* DASHBOARD INTEGRATION */}
      <section id="for-stores" className="py-24 bg-bg-surface border-y border-border relative">
         <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(74, 144, 226, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 144, 226, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-reveal">
                <span className="text-blue font-bold text-[11px] uppercase tracking-[0.4em] mb-4 block">STORE TERMINAL</span>
                <h2 className="brand text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8">Ready to expand <br/>your <span className="text-gold">Tindahan?</span></h2>
                {!publicKey && (
                   <p className="text-base sm:text-lg text-text-secondary mb-10 max-w-2xl mx-auto font-light">Connect your Stellar wallet to access regional catalogs and procurement tools.</p>
                )}
            </div>

            {!publicKey && !connecting ? (
               <div className="max-w-xl mx-auto scroll-reveal">
                   <div className="bg-bg-card p-12 rounded-3xl border border-border text-center shadow-2xl">
                      <div className="h-20 w-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8">
                         <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></svg>
                      </div>
                      <h3 className="brand text-2xl font-bold mb-4">Illuminate Your Capital</h3>
                      <p className="text-base text-text-secondary mb-10 font-light">Connect Freighter to receive personalized USDC yield strategies and regional pricing alerts.</p>
                      <button onClick={wallet.connect} className="w-full bg-gold text-bg-primary py-4 rounded-xl font-bold text-base sm:text-lg hover:scale-[1.02] transition-transform">
                         Connect Wallet
                      </button>
                   </div>
               </div>
            ) : publicKey && (
               <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 stagger-reveal">
                  {/* Left Sidebar */}
                  <div className="lg:col-span-4 space-y-8">
                     <div className="bg-bg-card p-8 rounded-3xl border border-border shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-6">Store Wallet</h3>
                        
                        <div className="mb-8 rounded-xl bg-bg-surface p-4 border border-border overflow-hidden">
                           <p className="text-[10px] font-mono text-text-muted break-all leading-relaxed">{publicKey}</p>
                        </div>

                        <BalanceCard publicKey={publicKey} refreshKey={refreshKey} />
                        
                        <div className="mt-8 grid grid-cols-2 gap-4">
                           <FundAccount publicKey={publicKey} onFunded={refresh} />
                           <AddTrustline publicKey={publicKey} onDone={refresh} />
                        </div>
                     </div>

                     <div className="bg-bg-surface p-8 rounded-3xl border border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-gold/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                        <h3 className="mb-2 font-bold text-gold brand text-lg">Supplier Insight</h3>
                        <p className="text-sm text-text-secondary leading-relaxed font-light">
                           Rice prices in the Regional Hub are <span className="text-green font-bold">5% lower</span> this week. Order now to maximize your margin.
                        </p>
                        <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                           <span>Inventory Health</span>
                           <span className="text-green">Optimal</span>
                        </div>
                        <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                           <div className="h-full w-4/5 bg-gold shadow-[0_0_10px_rgba(245,197,66,0.5)]"></div>
                        </div>
                     </div>
                  </div>

                  {/* Right Portal */}
                  <div className="lg:col-span-8 space-y-12">
                     <div className="bg-bg-card p-8 rounded-3xl border border-border shadow-xl">
                        <ProcurementPortal publicKey={publicKey} onSent={refresh} />
                     </div>
                     
                     <div className="bg-bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                        <div className="bg-bg-surface px-10 py-6 border-b border-border">
                           <h2 className="brand text-lg font-black text-text-primary uppercase tracking-tight">Direct Supplier Payment</h2>
                        </div>
                        <div className="p-10">
                           <SendPayment publicKey={publicKey} onSent={refresh} />
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </section>

      {/* 5. PLATFORM FEATURES */}
      <section id="for-suppliers" className="py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 scroll-reveal">
               <span className="text-gold font-bold text-[11px] uppercase tracking-[0.4em] mb-4 block">PLATFORM FEATURES</span>
               <h2 className="brand text-3xl sm:text-4xl lg:text-5xl font-extrabold">Built for the Tindahan.<br/>Powered by Stellar.</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-reveal">
               {[
                  { t: 'Regional Catalog', d: 'Browse 500+ SKUs from verified distributors across Luzon, Visayas, Mindanao.' },
                  { t: 'USDC Payments', d: 'Pay suppliers in USDC stablecoin. No forex risk, no remittance fees, no middlemen.' },
                  { t: 'Zero-Fee Rails', d: 'Stellar Network charges effectively zero per transaction. Pass savings to store margins.' },
                  { t: 'Supplier Insights', d: 'Weekly price intelligence. Know when rice is 5% cheaper in the next region.' },
                  { t: 'Inventory Health', d: 'Track your stock levels and get reorder alerts before you run out.' },
                  { t: 'On-Chain Receipts', d: 'Every order, every payment, permanently recorded on Stellar ledger.' }
               ].map((f, i) => (
                  <div key={i} className="bg-bg-surface p-10 rounded-3xl border border-border hover:border-blue transition-colors group">
                     <div className="h-10 w-10 bg-bg-card rounded flex items-center justify-center text-blue mb-6 group-hover:scale-110 transition-transform">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                     </div>
                     <h3 className="brand text-xl font-bold mb-4">{f.t}</h3>
                     <p className="text-sm text-text-secondary leading-relaxed font-light">{f.d}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. STATS SECTION */}
      <section className="py-24 bg-bg-surface border-y border-border">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-bg-card rounded-[3rem] border border-border p-16 md:p-24 relative overflow-hidden scroll-reveal">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-blue to-green"></div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center mb-24">
                  {[
                     { val: '12,000+', lab: 'Sari-sari stores onboarded' },
                     { val: '₱0', lab: 'Average transaction fee' },
                     { val: '4.8s', lab: 'Average payment settlement' },
                     { val: '₱2.3B', lab: 'Total USDC volume processed' }
                  ].map((stat, i) => (
                     <div key={i}>
                        <div className="brand text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gold mb-2">{stat.val}</div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{stat.lab}</div>
                     </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                     { q: "SariSync changed how I stock my store. I save ₱2,000 a week on logistics alone.", a: "Ate Rosario, Cebu City" },
                     { q: "Paying suppliers instantly with USDC feels like the future. No more lost receipts.", a: "Aling Nena, Quezon City" }
                  ].map((quote, i) => (
                     <div key={i} className="bg-bg-surface p-8 rounded-2xl border border-border italic text-sm text-text-secondary font-light">
                        "{quote.q}"
                        <div className="not-italic mt-4 text-xs font-bold text-text-primary uppercase tracking-widest brand">— {quote.a}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 8. PRICING SECTION */}
      <section id="pricing" className="py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 scroll-reveal">
               <span className="text-gold font-bold text-[11px] uppercase tracking-[0.4em] mb-4 block">PRICING</span>
               <h2 className="brand text-3xl sm:text-4xl lg:text-5xl font-extrabold">Simple. Transparent.<br/>Free to start.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-reveal">
               {[
                  { t: 'Tingi', p: 'Free', features: ['Up to 10 orders/month', '1 supplier connection', 'Basic catalog access'] },
                  { t: 'Tindan', p: '₱499', features: ['Unlimited orders', '10 supplier connections', 'Inventory alerts', 'Purchase history'], popular: true },
                  { t: 'Negosyo', p: '₱1,499', features: ['Everything in Tindahan', 'Bulk pricing negotiation', 'Dedicated account manager', 'API access'] }
               ].map((tier, i) => (
                  <div key={i} className={`p-12 rounded-3xl border ${tier.popular ? 'border-gold bg-bg-surface relative scale-105 shadow-2xl shadow-gold/5' : 'border-border bg-bg-card'}`}>
                     {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-bg-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest brand">Most Popular</div>}
                     <h3 className="brand text-xl sm:text-2xl font-bold mb-2">{tier.t}</h3>
                     <div className="flex items-baseline gap-2 mb-8">
                        <span className="brand text-3xl sm:text-4xl font-extrabold text-gold">{tier.p}</span>
                        {tier.p !== 'Free' && <span className="text-text-muted text-sm font-light">/mo</span>}
                     </div>
                     <ul className="space-y-4 mb-10">
                        {tier.features.map((f, j) => (
                           <li key={j} className="text-sm text-text-secondary flex gap-3 font-light">
                              <span className="text-gold font-bold">✓</span> {f}
                           </li>
                        ))}
                     </ul>
                     <button 
                        onClick={() => alert(`Subscribing to ${tier.t} plan...`)}
                        className={`w-full py-4 rounded-xl font-bold brand text-sm sm:text-base transition-all ${tier.popular ? 'bg-gold text-bg-primary hover:brightness-110' : 'bg-bg-surface text-text-primary border border-border hover:bg-white/5'}`}
                     >
                        Choose Plan
                     </button>
                  </div>
               ))}
            </div>
            <p className="text-center text-text-muted mt-12 text-sm font-light">Transaction fees: <span className="text-gold font-bold brand">₱0.00</span> on Stellar Network</p>
         </div>
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="bg-bg-surface border-t border-border py-20">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
               <div className="max-w-xs">
                  <div className="brand text-3xl font-extrabold text-gold mb-4 uppercase tracking-tighter">Tindahan.USDC</div>
                  <p className="text-sm text-text-muted leading-relaxed font-light">
                     Powered by Stellar · Built for Filipino Stores. Scaling micro-commerce one barangay at a time.
                  </p>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary mb-6 brand">Product</h4>
                     <ul className="space-y-3 text-sm text-text-muted font-light">
                        <li><button onClick={() => alert('Opening Regional Catalog...')} className="hover:text-gold transition-colors">Catalog</button></li>
                        <li><button onClick={() => alert('USDC Payments documentation...')} className="hover:text-gold transition-colors">USDC Payments</button></li>
                        <li><button onClick={() => alert('Supplier Portal registration...')} className="hover:text-gold transition-colors">Supplier Portal</button></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary mb-6 brand">Company</h4>
                     <ul className="space-y-3 text-sm text-text-muted font-light">
                        <li><button onClick={() => alert('About SariSync...')} className="hover:text-gold transition-colors">About Us</button></li>
                        <li><button onClick={() => alert('Careers at SariSync...')} className="hover:text-gold transition-colors">Careers</button></li>
                        <li><button onClick={() => alert('Contacting support...')} className="hover:text-gold transition-colors">Contact</button></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary mb-6 brand">Legal</h4>
                     <ul className="space-y-3 text-sm text-text-muted font-light">
                        <li><button onClick={() => alert('Privacy Policy...')} className="hover:text-gold transition-colors">Privacy</button></li>
                        <li><button onClick={() => alert('Terms of Service...')} className="hover:text-gold transition-colors">Terms</button></li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="pt-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.5em] brand">© 2026 SariSync // Philippines</p>
               <div className="flex gap-6">
                  <span onClick={() => alert('Redirecting to Twitter...')} className="text-text-muted hover:text-white transition-colors cursor-pointer text-xs brand">Twitter</span>
                  <span onClick={() => alert('Redirecting to LinkedIn...')} className="text-text-muted hover:text-white transition-colors cursor-pointer text-xs brand">LinkedIn</span>
                  <span onClick={() => alert('Redirecting to GitHub...')} className="text-text-muted hover:text-white transition-colors cursor-pointer text-xs brand">GitHub</span>
               </div>
            </div>
         </div>
      </footer>
    </main>
  );
}
