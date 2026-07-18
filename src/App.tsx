import { useState, useEffect } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | 'splash'
  | 'how-it-works'
  | 'permissions'
  | 'bank-link'
  | 'dashboard'
  | 'convert-detect'
  | 'convert-confirm'
  | 'converting'
  | 'success'
  | 'history'
  | 'settings'

interface Tx {
  id: string
  date: string
  bundle: string
  gb: number
  amount: number
  status: 'completed' | 'pending'
  bank: string
  last4: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const TXS: Tx[] = [
  { id: 'TXN-2848', date: 'Jul 18, 2026', bundle: 'SME',   gb: 5,  amount: 3250, status: 'completed', bank: 'GTBank',      last4: '4521' },
  { id: 'TXN-2651', date: 'Jul 14, 2026', bundle: 'SME',   gb: 2,  amount: 1300, status: 'completed', bank: 'Access Bank',  last4: '7832' },
  { id: 'TXN-2432', date: 'Jul 09, 2026', bundle: 'SME',   gb: 10, amount: 6200, status: 'completed', bank: 'GTBank',      last4: '4521' },
  { id: 'TXN-2198', date: 'Jul 01, 2026', bundle: 'Promo', gb: 3,  amount: 1050, status: 'completed', bank: 'GTBank',      last4: '4521' },
  { id: 'TXN-2011', date: 'Jun 25, 2026', bundle: 'SME',   gb: 5,  amount: 3100, status: 'pending',   bank: 'GTBank',      last4: '4521' },
]

const BANKS = [
  'GTBank', 'Access Bank', 'First Bank', 'UBA', 'Zenith Bank',
  'Fidelity Bank', 'Polaris Bank', 'Sterling Bank', 'Wema Bank', 'Kuda',
]

const fmt = (n: number) => '₦' + n.toLocaleString('en-NG')

// ─── SVG Icon Components ──────────────────────────────────────────────────────

function IconSignal({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" />
    </svg>
  )
}

function IconZap({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconWifi({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  )
}

function IconShield({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconPhone({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconSmartphone({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function IconEye({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconBarChart({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

function IconDollarSign({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconSend({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconCheck({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconCheckCircle({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconCreditCard({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function IconClock({ size = 20, color = '#5A8870' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconLogOut({ size = 14, color = '#FF6B35' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconSettings({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconUser({ size = 20, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconArrowRight({ size = 16, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconRefresh({ size = 14, color = '#FF9F6B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function IconLock({ size = 16, color = '#5A8870' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconTrendingUp({ size = 16, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function IconLoader({ size = 14, color = '#AAFF45' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin-slow">
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  )
}

function IconInbox({ size = 20, color = '#5A8870' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
      style={{ background: 'rgba(170,255,69,0.07)', border: '1px solid rgba(170,255,69,0.12)' }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11 5L7 9L11 13" stroke="#AAFF45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function PrimaryBtn({
  label, onClick, disabled = false, danger = false,
}: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full font-bold text-[15px] py-4 rounded-2xl transition-all active:scale-95 select-none"
      style={{
        background: disabled ? '#112A1A' : danger ? '#FF6B35' : '#AAFF45',
        color:      disabled ? '#2E6040' : danger ? '#fff'    : '#030F07',
        cursor:     disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
      style={{ border: '1px solid rgba(170,255,69,0.15)', color: '#7AAD8A' }}
    >
      {label}
    </button>
  )
}

// ─── Screen: Splash ───────────────────────────────────────────────────────────

function Splash({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      {/* Logo */}
      <div className="px-6 pt-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[11px] tracking-tight select-none" style={{ background: '#AAFF45', color: '#030F07' }}>
          D2C
        </div>
        <span className="font-bold text-[17px] tracking-tight">Data2Cash</span>
      </div>

      {/* Hero */}
      <div className="flex-1 px-6 flex flex-col justify-center py-10">
        {/* Glow blob */}
        <div className="relative mb-2">
          <div
            className="absolute -top-10 -left-10 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(170,255,69,0.08) 0%, transparent 70%)' }}
          />
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: '#AAFF45' }}>
            MTN Nigeria
          </p>
          <h1 className="text-[3rem] font-extrabold leading-[1.08] mb-5">
            Your Data.<br />
            <span style={{ color: '#AAFF45' }}>Your Cash.</span>
          </h1>
          <p className="text-[17px] leading-relaxed mb-8" style={{ color: '#7AAD8A' }}>
            Convert excess MTN data to Naira — credited directly to your bank account. No middleman. No waiting.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col gap-3">
          {[
            { icon: <IconZap size={16} />, label: 'Instant bank credit — usually seconds' },
            { icon: <IconSignal size={16} />, label: 'Auto-detects your SIM & data balance' },
            { icon: <IconShield size={16} />, label: 'No "find a buyer" step — ever' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(170,255,69,0.09)' }}
              >
                {icon}
              </div>
              <span className="text-[14px]" style={{ color: '#7AAD8A' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10">
        <PrimaryBtn label="Get Started →" onClick={() => go('how-it-works')} />
        <p className="text-center text-[11px] mt-4 tracking-wide" style={{ color: '#2E6040' }}>
          MTN Network · 256-bit encrypted
        </p>
      </div>
    </div>
  )
}

// ─── Screen: How It Works ─────────────────────────────────────────────────────

function HowItWorks({ go }: { go: (s: Screen) => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: <IconSignal size={32} />,
      title: 'We detect your SIM',
      body: "Data2Cash reads your MTN SIM details automatically using READ_PHONE_STATE. You don't choose a network — we already know.",
      tag: 'READ_PHONE_STATE  ·  read-only',
    },
    {
      icon: <IconBarChart size={32} />,
      title: 'We check your balance',
      body: 'We silently dial a USSD code on your behalf to read your data bundle and balance — the whole thing takes about 3 seconds.',
      tag: 'CALL_PHONE  +  Accessibility Service',
    },
    {
      icon: <IconDollarSign size={32} />,
      title: 'Cash hits your bank',
      body: 'The moment your bundle is transferred, your Naira arrives via Paystack — directly to your linked bank account.',
      tag: 'Powered by Paystack Transfers API',
    },
  ]

  const cur = steps[step]

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="flex items-center justify-between px-6 pt-3 pb-6">
        <BackBtn onBack={() => go('splash')} />
        <span style={{ color: '#5A8870', fontSize: '12px', fontWeight: 600 }}>Step {step + 1} of 3</span>
      </div>

      <div className="flex-1 px-6 flex flex-col justify-center">
        {/* Big icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
          style={{ background: 'rgba(170,255,69,0.08)', border: '1px solid rgba(170,255,69,0.14)' }}
        >
          {cur.icon}
        </div>

        <h2 className="text-[2rem] font-extrabold mb-4 leading-tight">{cur.title}</h2>
        <p className="text-[16px] leading-relaxed mb-6" style={{ color: '#7AAD8A' }}>{cur.body}</p>

        <div
          className="px-3 py-2.5 rounded-xl mb-10 flex items-center gap-2"
          style={{ background: 'rgba(170,255,69,0.05)', border: '1px solid rgba(170,255,69,0.1)' }}
        >
          <IconLock size={13} color="#5A8870" />
          <span className="text-[12px]" style={{ fontFamily: 'DM Mono, monospace', color: '#5A8870' }}>{cur.tag}</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width:      i === step ? '28px' : '8px',
                background: i === step ? '#AAFF45' : i < step ? 'rgba(170,255,69,0.4)' : 'rgba(170,255,69,0.14)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-10">
        <PrimaryBtn
          label={step < 2 ? 'Next →' : 'Set Up Permissions →'}
          onClick={() => step < 2 ? setStep(step + 1) : go('permissions')}
        />
      </div>
    </div>
  )
}

// ─── Screen: Permissions ──────────────────────────────────────────────────────

function Permissions({ go }: { go: (s: Screen) => void }) {
  const [granted, setGranted] = useState<string[]>([])

  const perms = [
    {
      key:  'phone',
      icon: <IconPhone size={16} />,
      name: 'CALL_PHONE',
      why:  'To dial the USSD code silently on your behalf — only ever triggered when you tap Convert.',
    },
    {
      key:  'state',
      icon: <IconSmartphone size={16} />,
      name: 'READ_PHONE_STATE',
      why:  'To detect your MTN SIM automatically — so you never have to manually select a network.',
    },
    {
      key:  'a11y',
      icon: <IconEye size={16} />,
      name: 'Accessibility Service',
      why:  'To read the USSD pop-up response and extract your balance. It reads nothing else — ever.',
    },
  ]

  const toggle = (k: string) =>
    setGranted(g => g.includes(k) ? g.filter(x => x !== k) : [...g, k])

  const allGranted = granted.length === perms.length

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="px-6 pt-3 pb-4">
        <BackBtn onBack={() => go('how-it-works')} />
      </div>

      <div className="flex-1 px-6">
        <h2 className="text-[2rem] font-extrabold mb-2 leading-tight">3 permissions needed</h2>
        <p className="text-[14px] mb-7" style={{ color: '#7AAD8A' }}>
          Tap each one to grant it. We've written exactly why we need it — no surprises.
        </p>

        <div className="flex flex-col gap-3 mb-5">
          {perms.map(p => {
            const active = granted.includes(p.key)
            return (
              <button
                key={p.key}
                onClick={() => toggle(p.key)}
                className="w-full text-left p-4 rounded-2xl transition-all"
                style={{
                  background: active ? 'rgba(170,255,69,0.07)' : '#0C2318',
                  border:     `1px solid ${active ? 'rgba(170,255,69,0.28)' : 'rgba(170,255,69,0.07)'}`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      {p.icon}
                      <span
                        className="text-[13px] font-semibold"
                        style={{ fontFamily: 'DM Mono, monospace', color: active ? '#AAFF45' : '#F0FAF0' }}
                      >
                        {p.name}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: '#5A8870' }}>{p.why}</p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-all"
                    style={{
                      background: active ? '#AAFF45' : 'transparent',
                      border:     active ? 'none' : '1.5px solid rgba(170,255,69,0.25)',
                    }}
                  >
                    {active && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4.5L4.5 8L11 1" stroke="#030F07" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div
          className="p-3.5 rounded-xl flex items-start gap-2.5"
          style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.06)' }}
        >
          <div className="mt-0.5 flex-shrink-0"><IconShield size={14} color="#5A8870" /></div>
          <p className="text-[12px] leading-relaxed" style={{ color: '#5A8870' }}>
            These permissions activate <em>only</em> when you tap "Convert My Data." We never dial numbers,
            read messages, or access contacts without your explicit action.
          </p>
        </div>
      </div>

      <div className="px-6 pb-10 pt-6">
        <PrimaryBtn
          label={allGranted ? 'Link Your Bank Account →' : `Grant permissions (${granted.length}/${perms.length})`}
          onClick={() => go('bank-link')}
        />
        {!allGranted && (
          <p className="text-center text-[11px] mt-3" style={{ color: '#2E6040' }}>
            Tap all 3 to continue — or skip for the demo
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Screen: Bank Link ────────────────────────────────────────────────────────

function BankLink({ go }: { go: (s: Screen) => void }) {
  const [bank, setBank]   = useState('')
  const [acct, setAcct]   = useState('')
  const [name, setName]   = useState('')
  const [bvn,  setBvn]    = useState('')
  const [resolving, setResolving] = useState(false)

  useEffect(() => {
    if (acct.length === 10 && bank) {
      setResolving(true)
      setName('')
      const t = setTimeout(() => {
        setName('ADAEZE OKONKWO')
        setResolving(false)
      }, 900)
      return () => clearTimeout(t)
    } else {
      setName('')
    }
  }, [acct, bank])

  const ready = bank && acct.length === 10 && name && bvn.length === 11

  const inputStyle = (active: boolean) => ({
    background: '#0C2318',
    border:     `1px solid ${active ? 'rgba(170,255,69,0.3)' : 'rgba(170,255,69,0.09)'}`,
    color:      '#F0FAF0',
    outline:    'none',
    borderRadius: '12px',
    padding:    '14px 16px',
    width:      '100%',
    fontSize:   '14px',
  })

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="px-6 pt-3 pb-4">
        <BackBtn onBack={() => go('permissions')} />
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        <h2 className="text-[2rem] font-extrabold mb-1.5 leading-tight">Link your bank account</h2>
        <p className="text-[14px] mb-7" style={{ color: '#7AAD8A' }}>
          This is where your Naira lands. Encrypted and safe.
        </p>

        {/* Bank */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold mb-2 tracking-[0.14em] uppercase" style={{ color: '#5A8870' }}>
            Bank
          </label>
          <select
            value={bank}
            onChange={e => setBank(e.target.value)}
            style={{ ...inputStyle(!!bank), appearance: 'none' }}
          >
            <option value="">Select your bank…</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Account number */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold mb-2 tracking-[0.14em] uppercase" style={{ color: '#5A8870' }}>
            Account Number
          </label>
          <input
            type="tel"
            maxLength={10}
            placeholder="0123456789"
            value={acct}
            onChange={e => setAcct(e.target.value.replace(/\D/g, ''))}
            style={{ ...inputStyle(acct.length === 10), fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}
          />
        </div>

        {/* Resolved name */}
        {resolving && (
          <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(170,255,69,0.05)' }}>
            <IconLoader size={13} />
            <span className="text-[13px] animate-pulse" style={{ color: '#5A8870' }}>Verifying account…</span>
          </div>
        )}
        {name && !resolving && (
          <div
            className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in"
            style={{ background: 'rgba(170,255,69,0.07)', border: '1px solid rgba(170,255,69,0.22)' }}
          >
            <IconCheck size={14} />
            <span className="text-[13px] font-bold tracking-wider" style={{ color: '#AAFF45' }}>{name}</span>
          </div>
        )}

        {/* BVN */}
        <div className="mb-2">
          <label className="block text-[11px] font-bold mb-2 tracking-[0.14em] uppercase" style={{ color: '#5A8870' }}>
            BVN — for KYC verification
          </label>
          <input
            type="tel"
            maxLength={11}
            placeholder="22345678901"
            value={bvn}
            onChange={e => setBvn(e.target.value.replace(/\D/g, ''))}
            style={{ ...inputStyle(bvn.length === 11), fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em' }}
          />
        </div>
        <p className="text-[11px] mb-8 leading-relaxed" style={{ color: '#2E6040' }}>
          CBN KYC requirement for payouts above ₦50,000/month. Verified once — not stored on our servers.
        </p>

        {/* Trust badge */}
        <div
          className="p-3.5 rounded-xl flex items-start gap-3 mb-4"
          style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.06)' }}
        >
          <div className="mt-0.5 flex-shrink-0"><IconCreditCard size={18} color="#7AAD8A" /></div>
          <div>
            <p className="text-[12px] font-semibold mb-0.5">Paystack-secured transfers</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#5A8870' }}>
              Your payout goes via Paystack's Transfers API — the same infrastructure used by thousands of Nigerian businesses.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <PrimaryBtn label="Continue to Dashboard →" onClick={() => go('dashboard')} disabled={!ready} />
        {!ready && (
          <p className="text-center text-[11px] mt-3" style={{ color: '#2E6040' }}>
            Fill in all fields to continue
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────

function Dashboard({ go }: { go: (s: Screen) => void }) {
  const earned = TXS.filter(t => t.status === 'completed').reduce((a, t) => a + t.amount, 0)

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <div>
            <p className="text-[12px] mb-0.5" style={{ color: '#5A8870' }}>Good afternoon,</p>
            <h2 className="text-[22px] font-extrabold tracking-tight">Adaeze</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go('settings')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{ background: 'rgba(170,255,69,0.07)', border: '1px solid rgba(170,255,69,0.12)' }}
            >
              <IconSettings size={16} color="#7AAD8A" />
            </button>
            <button
              onClick={() => go('splash')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{ background: 'rgba(255,107,53,0.07)', border: '1px solid rgba(255,107,53,0.12)' }}
              title="Log out"
            >
              <IconLogOut size={16} />
            </button>
          </div>
        </div>

        {/* Wallet card */}
        <div
          className="mx-6 my-4 p-5 rounded-3xl relative overflow-hidden"
          style={{
            background:  'linear-gradient(145deg, #102C1C 0%, #0A1F13 100%)',
            border:      '1px solid rgba(170,255,69,0.12)',
            boxShadow:   '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Decorative gradient orb */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(170,255,69,0.06) 0%, transparent 70%)' }} />
          
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: '#5A8870' }}>
            Total Earned
          </p>
          <p className="text-[42px] font-extrabold leading-none mb-1 tracking-tight">{fmt(earned)}</p>
          <div className="flex items-center gap-1.5 mb-5">
            <IconTrendingUp size={13} />
            <p className="text-[12px]" style={{ color: '#AAFF45' }}>
              {fmt(3250)} this week
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(170,255,69,0.08)' }}>
            <div>
              <p className="text-[10px] mb-1" style={{ color: '#5A8870' }}>Linked account</p>
              <p className="text-[13px] font-semibold" style={{ fontFamily: 'DM Mono, monospace' }}>
                GTBank •••• 4521
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] mb-1" style={{ color: '#5A8870' }}>Conversions</p>
              <p className="text-[13px] font-semibold">
                {TXS.filter(t => t.status === 'completed').length} completed
              </p>
            </div>
          </div>
        </div>

        {/* Network status badge */}
        <div className="mx-6 mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(170,255,69,0.06)', border: '1px solid rgba(170,255,69,0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#AAFF45' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#AAFF45' }}>MTN Nigeria</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(170,255,69,0.04)' }}>
            <IconShield size={11} color="#5A8870" />
            <span className="text-[11px] font-semibold" style={{ color: '#5A8870' }}>KYC Verified</span>
          </div>
        </div>

        {/* Detected bundle CTA */}
        <div className="mx-6 mb-4">
          <button
            onClick={() => go('convert-detect')}
            className="w-full p-5 rounded-2xl text-left transition-all active:scale-[0.98]"
            style={{ background: '#AAFF45', boxShadow: '0 4px 24px rgba(170,255,69,0.2)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold mb-1 tracking-wide" style={{ color: '#1A4D2E' }}>
                  ACTIVE BUNDLE DETECTED
                </p>
                <p className="text-[22px] font-extrabold mb-0.5" style={{ color: '#030F07' }}>SME 5GB available</p>
                <p className="text-[14px] font-semibold" style={{ color: '#1A5C30' }}>
                  Convert now → {fmt(3250)}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(3,15,7,0.1)' }}
              >
                <IconSignal size={24} color="#1A4D2E" />
              </div>
            </div>
          </button>
        </div>

        {/* Rate table teaser */}
        <div className="mx-6 mb-5 p-4 rounded-2xl" style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.07)' }}>
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3" style={{ color: '#5A8870' }}>
            Current rates
          </p>
          <div className="flex flex-col gap-2">
            {[
              { type: 'SME Bundle',   rate: '₦650/GB', hot: true  },
              { type: 'Regular Data', rate: '₦500/GB', hot: false },
              { type: 'Promo Data',   rate: '₦350/GB', hot: false },
            ].map(({ type, rate, hot }) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13px]" style={{ color: '#7AAD8A' }}>{type}</span>
                  {hot && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(170,255,69,0.12)', color: '#AAFF45' }}
                    >
                      BEST
                    </span>
                  )}
                </div>
                <span
                  className="text-[13px] font-bold"
                  style={{ fontFamily: 'DM Mono, monospace', color: hot ? '#AAFF45' : '#F0FAF0' }}
                >
                  {rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-bold">Recent</p>
            <button
              onClick={() => go('history')}
              className="text-[12px] font-semibold transition-all active:opacity-60 flex items-center gap-1"
              style={{ color: '#AAFF45' }}
            >
              View all <IconArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {TXS.slice(0, 4).map(tx => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.05)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: tx.status === 'completed'
                      ? 'rgba(170,255,69,0.09)'
                      : 'rgba(255,107,53,0.09)',
                  }}
                >
                  {tx.status === 'completed' ? <IconCheck size={16} /> : <IconRefresh />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{tx.bundle} {tx.gb}GB</p>
                  <p className="text-[11px]" style={{ color: '#5A8870' }}>
                    {tx.date} · {tx.bank}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-[14px] font-bold"
                    style={{ color: tx.status === 'completed' ? '#AAFF45' : '#FF9F6B' }}
                  >
                    +{fmt(tx.amount)}
                  </p>
                  <p className="text-[11px] capitalize" style={{ color: '#5A8870' }}>{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Convert Detect ───────────────────────────────────────────────────

function ConvertDetect({ go }: { go: (s: Screen) => void }) {
  const [done, setDone]         = useState(0)
  const [detected, setDetected] = useState(false)

  const steps = [
    'Detecting MTN SIM…',
    'Checking data balance…',
    'Reading bundle type…',
  ]

  useEffect(() => {
    const ts = [
      setTimeout(() => setDone(1), 900),
      setTimeout(() => setDone(2), 1900),
      setTimeout(() => setDone(3), 2900),
      setTimeout(() => setDetected(true), 3300),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="px-6 pt-3 pb-6">
        <BackBtn onBack={() => go('dashboard')} />
      </div>

      <div className="flex-1 px-6 flex flex-col justify-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-7"
          style={{ background: 'rgba(170,255,69,0.08)', border: '1px solid rgba(170,255,69,0.14)' }}
        >
          <IconWifi size={28} />
        </div>

        <h2 className="text-[2rem] font-extrabold mb-1.5 leading-tight">Scanning your SIM</h2>
        <p className="text-[14px] mb-8" style={{ color: '#7AAD8A' }}>Takes about 3 seconds…</p>

        {/* Step list */}
        <div className="flex flex-col gap-2.5 mb-8">
          {steps.map((step, i) => {
            const isDone   = done > i
            const isActive = done === i
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300"
                style={{
                  background: isDone ? 'rgba(170,255,69,0.06)' : '#0C2318',
                  border:     `1px solid ${isDone ? 'rgba(170,255,69,0.18)' : 'rgba(170,255,69,0.05)'}`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: isDone ? '#AAFF45' : 'rgba(170,255,69,0.08)' }}
                >
                  {isDone ? (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5L4 8L10 1" stroke="#030F07" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isActive ? (
                    <IconLoader size={12} />
                  ) : (
                    <span style={{ fontSize: '8px', color: '#2E6040' }}>○</span>
                  )}
                </div>
                <span
                  className="text-[14px] transition-colors"
                  style={{ color: isDone ? '#F0FAF0' : isActive ? '#7AAD8A' : '#2E6040' }}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* Detected result */}
        {detected && (
          <div
            className="p-5 rounded-2xl animate-slide-up"
            style={{ background: 'rgba(170,255,69,0.07)', border: '1px solid rgba(170,255,69,0.22)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <IconCheckCircle size={14} />
              <p className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: '#AAFF45' }}>
                Bundle detected
              </p>
            </div>
            <p className="text-[26px] font-extrabold mb-0.5">SME 5GB</p>
            <p className="text-[13px] mb-4" style={{ color: '#7AAD8A' }}>MTN Nigeria · Active bundle</p>
            <div className="flex items-baseline gap-2" style={{ borderTop: '1px solid rgba(170,255,69,0.1)', paddingTop: '12px' }}>
              <span className="text-[13px]" style={{ color: '#5A8870' }}>We can offer you</span>
              <span className="text-[26px] font-extrabold" style={{ color: '#AAFF45' }}>₦3,250</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-10 pt-6">
        <PrimaryBtn
          label="Review & Confirm →"
          onClick={() => go('convert-confirm')}
          disabled={!detected}
        />
      </div>
    </div>
  )
}

// ─── Screen: Convert Confirm ──────────────────────────────────────────────────

function ConvertConfirm({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="px-6 pt-3 pb-4">
        <BackBtn onBack={() => go('convert-detect')} />
      </div>

      <div className="flex-1 px-6">
        <h2 className="text-[2rem] font-extrabold mb-1.5 leading-tight">Confirm conversion</h2>
        <p className="text-[14px] mb-6" style={{ color: '#7AAD8A' }}>
          Review the details before we process your transfer.
        </p>

        {/* Breakdown */}
        <div
          className="p-5 rounded-2xl mb-4"
          style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.09)' }}
        >
          {[
            { label: 'Bundle',   value: 'SME 5GB',      mono: false },
            { label: 'Network',  value: 'MTN Nigeria',   mono: false },
            { label: 'Rate',     value: '₦650 / GB',     mono: true  },
            { label: 'Data sold', value: '5 GB',         mono: true  },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between mb-3.5">
              <span className="text-[13px]" style={{ color: '#5A8870' }}>{label}</span>
              <span
                className="text-[13px] font-semibold"
                style={{ fontFamily: mono ? 'DM Mono, monospace' : 'inherit' }}
              >
                {value}
              </span>
            </div>
          ))}

          <div className="my-1" style={{ borderTop: '1px solid rgba(170,255,69,0.08)' }} />

          <div className="flex items-center justify-between pt-3.5">
            <span className="text-[16px] font-bold">You receive</span>
            <span className="text-[32px] font-extrabold leading-none" style={{ color: '#AAFF45' }}>₦3,250</span>
          </div>
        </div>

        {/* Bank line */}
        <div
          className="p-4 rounded-xl mb-4 flex items-center gap-3"
          style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.07)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(170,255,69,0.08)' }}
          >
            <IconCreditCard size={18} color="#7AAD8A" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] mb-0.5" style={{ color: '#5A8870' }}>Credited to</p>
            <p className="text-[14px] font-semibold">GTBank •••• 4521</p>
            <p className="text-[11px]" style={{ color: '#5A8870' }}>ADAEZE OKONKWO</p>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(170,255,69,0.08)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#AAFF45' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#AAFF45' }}>Instant</span>
          </div>
        </div>

        {/* Legal note */}
        <p className="text-[11px] leading-relaxed" style={{ color: '#2E6040' }}>
          By confirming, you authorize Data2Cash to transfer your SME 5GB bundle.
          This action cannot be undone once processing begins.
        </p>
      </div>

      <div className="px-6 pb-10 pt-6 flex flex-col gap-3">
        <PrimaryBtn label="Confirm & Convert ₦3,250" onClick={() => go('converting')} />
        <GhostBtn   label="Cancel"                   onClick={() => go('dashboard')} />
      </div>
    </div>
  )
}

// ─── Screen: Converting ───────────────────────────────────────────────────────

function Converting({ go }: { go: (s: Screen) => void }) {
  const [phase, setPhase] = useState(0)

  const phases = [
    { label: 'Data transfer initiated',     detail: 'Dialing USSD silently…'       },
    { label: 'Processing conversion',        detail: 'Reading USSD response…'       },
    { label: 'Confirming via Paystack',      detail: 'Authorising bank transfer…'   },
    { label: 'Crediting your account',       detail: 'Sending ₦3,250 to GTBank…'   },
  ]

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 1200),
      setTimeout(() => setPhase(2), 2700),
      setTimeout(() => setPhase(3), 4100),
      setTimeout(() => go('success'), 5600),
    ]
    return () => ts.forEach(clearTimeout)
  }, [go])

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-6 animate-fade-in"
      style={{ background: '#030F07', color: '#F0FAF0' }}
    >
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center mb-10">
        <div
          className="absolute w-36 h-36 rounded-full animate-pulse-ring"
          style={{ background: 'rgba(170,255,69,0.12)' }}
        />
        <div
          className="absolute w-28 h-28 rounded-full animate-pulse-ring"
          style={{ background: 'rgba(170,255,69,0.08)', animationDelay: '0.4s' }}
        />
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(170,255,69,0.12)',
            border:     '1.5px solid rgba(170,255,69,0.28)',
            boxShadow:  '0 0 40px rgba(170,255,69,0.15)',
          }}
        >
          <IconSend size={32} />
        </div>
      </div>

      <h2 className="text-[28px] font-extrabold mb-1.5 text-center">Converting…</h2>
      <p className="text-[14px] mb-10 text-center" style={{ color: '#7AAD8A' }}>
        Don't close this app
      </p>

      {/* Step list */}
      <div className="w-full flex flex-col gap-3">
        {phases.map((p, i) => {
          const isDone   = i < phase
          const isActive = i === phase
          return (
            <div
              key={i}
              className="flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300"
              style={{
                background: isDone ? 'rgba(170,255,69,0.05)' : isActive ? 'rgba(170,255,69,0.03)' : 'transparent',
                border:     `1px solid ${isDone ? 'rgba(170,255,69,0.15)' : isActive ? 'rgba(170,255,69,0.1)' : 'transparent'}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  background: isDone   ? '#AAFF45'
                    : isActive ? 'rgba(170,255,69,0.15)'
                    : 'transparent',
                  border: isDone ? 'none' : isActive ? '1px solid rgba(170,255,69,0.3)' : '1px solid rgba(170,255,69,0.1)',
                }}
              >
                {isDone && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 7L9 1" stroke="#030F07" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isActive && <span className="animate-pulse text-[6px]" style={{ color: '#AAFF45' }}>●</span>}
              </div>
              <div className="flex-1">
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: isDone ? '#F0FAF0' : isActive ? '#AAFF45' : '#2E6040' }}
                >
                  {p.label}
                </p>
                {isActive && (
                  <p className="text-[11px] mt-0.5 animate-pulse" style={{ color: '#5A8870' }}>
                    {p.detail}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Screen: Success ──────────────────────────────────────────────────────────

function Success({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Icon */}
        <div className="relative flex items-center justify-center mb-8">
          <div
            className="absolute w-36 h-36 rounded-full animate-pulse-ring"
            style={{ background: 'rgba(170,255,69,0.1)' }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(170,255,69,0.1)',
              border:     '1.5px solid rgba(170,255,69,0.3)',
              boxShadow:  '0 0 60px rgba(170,255,69,0.12)',
            }}
          >
            <IconCheckCircle size={44} />
          </div>
        </div>

        <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: '#AAFF45' }}>
          Transfer Complete
        </p>
        <p className="text-[52px] font-extrabold leading-none mb-2 tracking-tight shimmer-text">
          ₦3,250
        </p>
        <p className="text-[15px] mb-1" style={{ color: '#7AAD8A' }}>sent to GTBank account ending 4521</p>
        <p className="text-[13px] mb-8" style={{ color: '#5A8870' }}>ADAEZE OKONKWO</p>

        {/* Receipt card */}
        <div
          className="w-full p-4 rounded-2xl text-left mb-2"
          style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.09)' }}
        >
          {[
            { label: 'Transaction ID', value: 'TXN-2848', mono: true  },
            { label: 'Date & time',    value: 'Jul 18, 2026  ·  3:42 PM', mono: true  },
            { label: 'Bundle',         value: 'SME 5GB',    mono: false },
            { label: 'Rate applied',   value: '₦650/GB',    mono: true  },
          ].map(({ label, value, mono }, i, arr) => (
            <div
              key={label}
              className="flex items-center justify-between"
              style={{ paddingBottom: i < arr.length - 1 ? '10px' : '0', marginBottom: i < arr.length - 1 ? '10px' : '0', borderBottom: i < arr.length - 1 ? '1px solid rgba(170,255,69,0.06)' : 'none' }}
            >
              <span className="text-[12px]" style={{ color: '#5A8870' }}>{label}</span>
              <span
                className="text-[12px] font-semibold"
                style={{
                  fontFamily: mono ? 'DM Mono, monospace' : 'inherit',
                  color:      label === 'Transaction ID' ? '#AAFF45' : '#F0FAF0',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10 flex flex-col gap-3">
        <PrimaryBtn label="Convert More Data" onClick={() => go('convert-detect')} />
        <GhostBtn   label="View Transaction History" onClick={() => go('history')} />
        <button
          onClick={() => go('dashboard')}
          className="text-[13px] font-medium py-1 transition-all active:opacity-60"
          style={{ color: '#2E6040' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

// ─── Screen: History ──────────────────────────────────────────────────────────

function History({ go }: { go: (s: Screen) => void }) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  const visible  = filter === 'all' ? TXS : TXS.filter(t => t.status === filter)
  const totalEarned = TXS.filter(t => t.status === 'completed').reduce((a, t) => a + t.amount, 0)
  const completedCount = TXS.filter(t => t.status === 'completed').length

  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      {/* Header */}
      <div className="px-6 pt-3 pb-4 flex items-center gap-3">
        <BackBtn onBack={() => go('dashboard')} />
        <h2 className="text-[18px] font-extrabold">Transaction History</h2>
      </div>

      {/* Summary */}
      <div
        className="mx-6 mb-4 p-4 rounded-2xl"
        style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.07)' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] mb-1" style={{ color: '#5A8870' }}>Total earned</p>
            <p className="text-[26px] font-extrabold leading-none">{fmt(totalEarned)}</p>
          </div>
          <div className="w-px h-10 mx-2" style={{ background: 'rgba(170,255,69,0.08)' }} />
          <div className="text-right">
            <p className="text-[11px] mb-1" style={{ color: '#5A8870' }}>Completed</p>
            <p className="text-[26px] font-extrabold leading-none">{completedCount}</p>
          </div>
          <div className="w-px h-10 mx-2" style={{ background: 'rgba(170,255,69,0.08)' }} />
          <div className="text-right">
            <p className="text-[11px] mb-1" style={{ color: '#5A8870' }}>Pending</p>
            <p className="text-[26px] font-extrabold leading-none">{TXS.filter(t => t.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-6 mb-4 flex gap-2">
        {(['all', 'completed', 'pending'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-[12px] font-semibold capitalize transition-all"
            style={{
              background: filter === f ? '#AAFF45' : '#0C2318',
              color:      filter === f ? '#030F07' : '#5A8870',
              border:     filter === f ? 'none' : '1px solid rgba(170,255,69,0.08)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-2 pb-10">
        {visible.map(tx => (
          <div
            key={tx.id}
            className="p-4 rounded-2xl"
            style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.05)' }}
          >
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: tx.status === 'completed'
                      ? 'rgba(170,255,69,0.09)'
                      : 'rgba(255,107,53,0.09)',
                  }}
                >
                  {tx.status === 'completed' ? <IconCheck size={14} /> : <IconRefresh />}
                </div>
                <div>
                  <p className="text-[14px] font-bold">{tx.bundle} {tx.gb}GB</p>
                  <p className="text-[11px]" style={{ color: '#5A8870' }}>
                    {tx.date} · {tx.bank} ···· {tx.last4}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className="text-[16px] font-extrabold leading-tight"
                  style={{ color: tx.status === 'completed' ? '#AAFF45' : '#FF9F6B' }}
                >
                  +{fmt(tx.amount)}
                </p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: tx.status === 'completed'
                      ? 'rgba(170,255,69,0.1)'
                      : 'rgba(255,107,53,0.1)',
                    color: tx.status === 'completed' ? '#AAFF45' : '#FF9F6B',
                  }}
                >
                  {tx.status}
                </span>
              </div>
            </div>
            <p
              className="text-[11px]"
              style={{ fontFamily: 'DM Mono, monospace', color: '#2E6040' }}
            >
              {tx.id}
            </p>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3"><IconInbox size={32} /></div>
            <p className="text-[14px] font-semibold mb-1">No {filter} transactions</p>
            <p className="text-[13px]" style={{ color: '#5A8870' }}>Your history will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Screen: Settings ─────────────────────────────────────────────────────────

function Settings({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in" style={{ background: '#030F07', color: '#F0FAF0' }}>
      <div className="px-6 pt-3 pb-4 flex items-center gap-3">
        <BackBtn onBack={() => go('dashboard')} />
        <h2 className="text-[18px] font-extrabold">Settings</h2>
      </div>

      <div className="flex-1 px-6">
        {/* Profile card */}
        <div className="p-4 rounded-2xl mb-4 flex items-center gap-3" style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.07)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(170,255,69,0.09)' }}>
            <IconUser size={22} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold">Adaeze Okonkwo</p>
            <p className="text-[12px]" style={{ color: '#5A8870' }}>MTN · 0803 •••• 7891</p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(170,255,69,0.08)' }}>
            <IconShield size={11} color="#AAFF45" />
            <span className="text-[10px] font-bold" style={{ color: '#AAFF45' }}>Verified</span>
          </div>
        </div>

        {/* Settings sections */}
        <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3 mt-6" style={{ color: '#5A8870' }}>
          Payment
        </p>
        {[
          { icon: <IconCreditCard size={16} color="#7AAD8A" />, label: 'Linked Bank Account', value: 'GTBank •••• 4521' },
          { icon: <IconDollarSign size={16} color="#7AAD8A" />, label: 'Payout History', value: `${TXS.filter(t => t.status === 'completed').length} transactions` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl mb-2" style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.05)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(170,255,69,0.07)' }}>
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold">{label}</p>
              <p className="text-[11px]" style={{ color: '#5A8870' }}>{value}</p>
            </div>
            <IconArrowRight size={14} color="#2E6040" />
          </div>
        ))}

        <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3 mt-6" style={{ color: '#5A8870' }}>
          Security
        </p>
        {[
          { icon: <IconShield size={16} color="#7AAD8A" />, label: 'KYC Verification', value: 'BVN Verified' },
          { icon: <IconLock size={16} color="#7AAD8A" />, label: 'App Permissions', value: '3 of 3 granted' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl mb-2" style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.05)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(170,255,69,0.07)' }}>
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold">{label}</p>
              <p className="text-[11px]" style={{ color: '#5A8870' }}>{value}</p>
            </div>
            <IconArrowRight size={14} color="#2E6040" />
          </div>
        ))}

        <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-3 mt-6" style={{ color: '#5A8870' }}>
          About
        </p>
        {[
          { icon: <IconBarChart size={16} color="#7AAD8A" />, label: 'Rate Table', value: 'View current rates' },
          { icon: <IconSignal size={16} color="#7AAD8A" />, label: 'App Version', value: 'v1.0.0 (MVP)' },
        ].map(({ icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl mb-2" style={{ background: '#0C2318', border: '1px solid rgba(170,255,69,0.05)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(170,255,69,0.07)' }}>
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold">{label}</p>
              <p className="text-[11px]" style={{ color: '#5A8870' }}>{value}</p>
            </div>
            <IconArrowRight size={14} color="#2E6040" />
          </div>
        ))}
      </div>

      <div className="px-6 pb-10 pt-6">
        <button
          onClick={() => go('splash')}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ border: '1px solid rgba(255,107,53,0.2)', color: '#FF6B35' }}
        >
          <IconLogOut size={14} />
          Log Out
        </button>
      </div>
    </div>
  )
}

// ─── App shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const go = (s: Screen) => setScreen(s)

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{
        background: '#030F07',
        color: '#F0FAF0',
      }}
    >
      <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'none', maxWidth: '480px' }}>
        {screen === 'splash'           && <Splash          go={go} />}
        {screen === 'how-it-works'     && <HowItWorks      go={go} />}
        {screen === 'permissions'      && <Permissions     go={go} />}
        {screen === 'bank-link'        && <BankLink        go={go} />}
        {screen === 'dashboard'        && <Dashboard       go={go} />}
        {screen === 'convert-detect'   && <ConvertDetect   go={go} />}
        {screen === 'convert-confirm'  && <ConvertConfirm  go={go} />}
        {screen === 'converting'       && <Converting      go={go} />}
        {screen === 'success'          && <Success         go={go} />}
        {screen === 'history'          && <History         go={go} />}
        {screen === 'settings'         && <Settings        go={go} />}
      </div>
    </div>
  )
}
