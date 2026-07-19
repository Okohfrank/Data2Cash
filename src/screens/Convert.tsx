import React, { useState, useEffect } from 'react';
import { ScreenProps, Network } from '@/types';
import { fmt, AIRTIME_RATES, genTxId } from '@/data';
import {
  IconSignal,
  IconPhone,
  BackBtn,
  NetworkSelector,
  PrimaryBtn,
} from '@/components';

export function ConvertHub({ go }: ScreenProps) {
  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <BackBtn onBack={() => go('dashboard')} />
        <h1 className="text-xl font-medium">Convert to Cash</h1>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => go('convert-data-detect')}
          className="bg-[#0C2318] p-5 rounded-2xl border border-[#143324] flex items-center gap-4 text-left hover:bg-[#112F20] transition-colors"
        >
          <div className="bg-[#030F07] p-3 rounded-full">
            <IconSignal color="#AAFF45" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-[#AAFF45]">Data → Cash</h2>
            <p className="text-[#5A8870] text-sm">Convert excess data bundles to Naira.</p>
            <p className="text-[#7AAD8A] text-xs mt-1">Rates up to ₦650/GB</p>
          </div>
        </button>

        <button
          onClick={() => go('convert-airtime')}
          className="bg-[#0C2318] p-5 rounded-2xl border border-[#143324] flex items-center gap-4 text-left hover:bg-[#112F20] transition-colors"
        >
          <div className="bg-[#030F07] p-3 rounded-full">
            <IconPhone color="#AAFF45" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-[#AAFF45]">Airtime → Cash</h2>
            <p className="text-[#5A8870] text-sm">Convert airtime to cash at best rates.</p>
            <p className="text-[#7AAD8A] text-xs mt-1">Up to 80% return</p>
          </div>
        </button>
      </div>

      <div className="bottom-nav-spacer h-24" />
    </div>
  );
}

export function ConvertDataDetect({ go }: ScreenProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 900);
    const t2 = setTimeout(() => setStep(2), 1900);
    const t3 = setTimeout(() => setStep(3), 2900);
    const t4 = setTimeout(() => setStep(4), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const steps = [
    "Detecting SIM...",
    "Checking balance...",
    "Reading bundle type...",
    "Done"
  ];

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <BackBtn onBack={() => go('dashboard')} />
        <h1 className="text-xl font-medium">Detecting Data</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {step < 4 ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#143324] border-t-[#AAFF45] rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-[#AAFF45] font-medium text-lg">{steps[Math.min(step, 3)]}</h2>
            <p className="text-[#5A8870] text-sm mt-2">Please wait while we scan your active plans.</p>
          </div>
        ) : (
          <div className="bg-[#0C2318] p-6 rounded-2xl border border-[#143324] w-full text-center">
            <div className="bg-[#030F07] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#AAFF45]">
              <IconSignal color="#AAFF45" size={24} />
            </div>
            <h2 className="text-[#F0FAF0] font-medium text-xl mb-1">SME 5GB</h2>
            <p className="text-[#5A8870] text-sm mb-4">MTN Nigeria Detected</p>
            <div className="bg-[#030F07] rounded-xl p-4 mb-6">
              <div className="text-[#7AAD8A] text-xs mb-1">Cash Offer</div>
              <div className="text-3xl font-bold text-[#AAFF45]">₦3,250</div>
            </div>
            <PrimaryBtn
              onClick={() => go('convert-data-confirm')}
              label="Review & Confirm →"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function ConvertDataConfirm({ go, state, requestPin }: ScreenProps) {
  const handleConfirm = () => {
    requestPin(() => {
      go('convert-data-processing');
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <BackBtn onBack={() => go('convert-data-detect')} />
        <h1 className="text-xl font-medium">Review Conversion</h1>
      </div>

      <div className="bg-[#0C2318] p-5 rounded-2xl border border-[#143324] mb-6">
        <h2 className="text-[#7AAD8A] text-sm mb-4 font-medium">Conversion Breakdown</h2>
        
        <div className="flex justify-between items-center py-3 border-b border-[#143324]">
          <span className="text-[#5A8870] text-sm">Bundle</span>
          <span className="text-[#F0FAF0] text-sm font-medium">SME 5GB</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-[#143324]">
          <span className="text-[#5A8870] text-sm">Network</span>
          <span className="text-[#F0FAF0] text-sm font-medium">MTN</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-[#143324]">
          <span className="text-[#5A8870] text-sm">Rate</span>
          <span className="text-[#F0FAF0] text-sm font-medium">₦650/GB</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-[#5A8870] text-sm">Data Sold</span>
          <span className="text-[#F0FAF0] text-sm font-medium">5GB</span>
        </div>
      </div>

      <div className="bg-[#030F07] border border-[#143324] p-5 rounded-2xl mb-6">
        <div className="text-[#7AAD8A] text-sm mb-1">You Receive</div>
        <div className="text-3xl font-bold text-[#AAFF45]">₦3,250</div>
      </div>

      {state.linkedBank && (
        <div className="bg-[#0C2318] p-4 rounded-xl border border-[#143324] mb-8">
          <div className="text-[#5A8870] text-xs mb-1">Destination Bank</div>
          <div className="text-[#F0FAF0] text-sm font-medium">{state.linkedBank.bank}</div>
          <div className="text-[#7AAD8A] text-xs mt-1">Acct ending in {state.linkedBank.last4}</div>
        </div>
      )}

      <div className="mt-auto pb-6">
        <PrimaryBtn
          onClick={handleConfirm}
          label="Confirm & Convert ₦3,250"
        />
      </div>
    </div>
  );
}

export function ConvertDataProcessing({ go }: ScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 4200);
    const t4 = setTimeout(() => go('convert-data-success'), 5600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [go]);

  const phases = [
    "Data transfer initiated...",
    "Processing...",
    "Confirming via Paystack...",
    "Crediting account..."
  ];

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4 items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-4 border-[#143324] rounded-full" />
        <div className="absolute inset-0 border-4 border-t-[#AAFF45] rounded-full animate-spin" />
        <IconSignal color="#AAFF45" size={32} />
      </div>
      <h2 className="text-[#AAFF45] text-lg font-medium text-center">{phases[phase]}</h2>
    </div>
  );
}

export function ConvertDataSuccess({ go, state, setState }: ScreenProps) {
  useEffect(() => {
    const tx = {
      id: genTxId(),
      type: 'data-to-cash' as const,
      amount: 3250,
      date: new Date().toISOString(),
      status: 'completed' as const,
      details: {
        network: 'MTN',
        bundle: '5GB',
      }
    };
    setState({
      ...state,
      walletBalance: state.walletBalance + tx.amount,
      transactions: [tx, ...state.transactions],
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-20 h-20 bg-[#112F20] rounded-full flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#AAFF45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 className="text-2xl font-medium mb-2">Transfer Complete</h1>
        <div className="text-4xl font-bold text-[#AAFF45] mb-8 animate-pulse">₦3,250</div>

        <div className="bg-[#0C2318] p-5 rounded-2xl border border-[#143324] w-full text-left">
          <div className="flex justify-between items-center py-2 border-b border-[#143324]">
            <span className="text-[#5A8870] text-sm">Transaction ID</span>
            <span className="text-[#F0FAF0] text-sm font-mono">{genTxId()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#143324]">
            <span className="text-[#5A8870] text-sm">Date</span>
            <span className="text-[#F0FAF0] text-sm">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#143324]">
            <span className="text-[#5A8870] text-sm">Bundle</span>
            <span className="text-[#F0FAF0] text-sm">SME 5GB</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[#5A8870] text-sm">Rate</span>
            <span className="text-[#F0FAF0] text-sm">₦650/GB</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-6">
        <PrimaryBtn onClick={() => go('convert-data-detect')} label="Convert More Data" />
        <button onClick={() => go('history')} className="w-full py-4 text-[#AAFF45] font-medium border border-[#143324] rounded-xl hover:bg-[#112F20]">
          View History
        </button>
        <button onClick={() => go('dashboard')} className="w-full py-4 text-[#5A8870] font-medium hover:text-[#F0FAF0]">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export function ConvertAirtimeSelect({ go, state, setState }: ScreenProps) {
  const [network, setNetwork] = useState<Network>('MTN');
  const [amount, setAmount] = useState('');

  const rate = AIRTIME_RATES[network] || 0;
  const numAmount = parseInt(amount || '0', 10);
  const receiveAmount = numAmount * (rate / 100);

  const isValid = numAmount >= 100 && numAmount <= 50000;

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <BackBtn onBack={() => go('convert-hub')} />
        <h1 className="text-xl font-medium">Convert Airtime</h1>
      </div>

      <div className="mb-6">
        <label className="block text-[#7AAD8A] text-sm mb-3">Select Network</label>
        <NetworkSelector network={network} setNetwork={setNetwork} />
      </div>

      <div className="mb-6">
        <label className="block text-[#7AAD8A] text-sm mb-2">Airtime Amount (₦)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Min ₦100, Max ₦50,000"
          className="w-full bg-[#0C2318] border border-[#143324] rounded-xl px-4 py-4 text-[#F0FAF0] placeholder-[#5A8870] outline-none focus:border-[#AAFF45]"
        />
        <div className="text-right text-[#5A8870] text-xs mt-2">Conversion Rate: {rate}%</div>
      </div>

      <div className="bg-[#112F20] p-5 rounded-2xl border border-[#143324] mb-8">
        <div className="text-[#7AAD8A] text-sm mb-1">Cash Equivalent</div>
        <div className="text-3xl font-bold text-[#AAFF45]">₦{fmt(receiveAmount).replace('₦', '')}</div>
      </div>

      <div className="mt-auto pb-6">
        <PrimaryBtn
          onClick={() => go('convert-airtime-confirm', { convertAirtimeState: { network, amount: numAmount, receiveAmount }})}
          label="Continue →"
          disabled={!isValid}
        />
      </div>
    </div>
  );
}

export function ConvertAirtimeConfirm({ go, state, requestPin }: ScreenProps) {
  const { network, amount, receiveAmount } = state.currentScreenProps?.convertAirtimeState || { network: 'MTN', amount: 1000, receiveAmount: 800 };

  const rate = AIRTIME_RATES[network as Network] || 80;

  const handleConfirm = () => {
    requestPin(() => {
      go('convert-airtime-processing', { convertAirtimeState: { network, amount, receiveAmount } });
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <BackBtn onBack={() => go('convert-airtime')} />
        <h1 className="text-xl font-medium">Review Airtime</h1>
      </div>

      <div className="bg-[#0C2318] p-5 rounded-2xl border border-[#143324] mb-6">
        <h2 className="text-[#7AAD8A] text-sm mb-4 font-medium">Breakdown</h2>
        
        <div className="flex justify-between items-center py-3 border-b border-[#143324]">
          <span className="text-[#5A8870] text-sm">Network</span>
          <span className="text-[#F0FAF0] text-sm font-medium">{network}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-[#143324]">
          <span className="text-[#5A8870] text-sm">Airtime Amount</span>
          <span className="text-[#F0FAF0] text-sm font-medium">{fmt(amount)}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-[#143324]">
          <span className="text-[#5A8870] text-sm">Conversion Rate</span>
          <span className="text-[#F0FAF0] text-sm font-medium">{rate}%</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-[#5A8870] text-sm">Cash to Receive</span>
          <span className="text-[#AAFF45] text-sm font-medium">{fmt(receiveAmount)}</span>
        </div>
      </div>

      {state.linkedBank && (
        <div className="bg-[#0C2318] p-4 rounded-xl border border-[#143324] mb-6">
          <div className="text-[#5A8870] text-xs mb-1">Destination Bank</div>
          <div className="text-[#F0FAF0] text-sm font-medium">{state.linkedBank.bank}</div>
          <div className="text-[#7AAD8A] text-xs mt-1">Acct ending in {state.linkedBank.last4}</div>
        </div>
      )}

      <div className="bg-[#1a2e15] border border-[#AAFF45] bg-opacity-20 p-4 rounded-xl mb-8">
        <div className="text-[#AAFF45] font-medium text-sm mb-1">USSD Instruction</div>
        <div className="text-[#F0FAF0] text-sm">
          After confirming, dial <span className="font-mono text-[#AAFF45]">*600*{amount}*PLATFORM_NUMBER#</span> to transfer airtime.
        </div>
      </div>

      <div className="mt-auto pb-6">
        <PrimaryBtn
          onClick={handleConfirm}
          label="Confirm"
        />
      </div>
    </div>
  );
}

export function ConvertAirtimeProcessing({ go, state }: ScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => setPhase(3), 4500);
    const t4 = setTimeout(() => {
      go('convert-airtime-success', { convertAirtimeState: state.currentScreenProps?.convertAirtimeState });
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [go, state]);

  const phases = [
    "Waiting for airtime transfer...",
    "Verifying receipt...",
    "Processing payout...",
    "Crediting bank..."
  ];

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4 items-center justify-center">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-4 border-[#143324] rounded-full" />
        <div className="absolute inset-0 border-4 border-t-[#AAFF45] rounded-full animate-spin" />
        <IconPhone color="#AAFF45" size={32} />
      </div>
      <h2 className="text-[#AAFF45] text-lg font-medium text-center">{phases[phase]}</h2>
    </div>
  );
}

export function ConvertAirtimeSuccess({ go, state, setState }: ScreenProps) {
  const { network, amount, receiveAmount } = state.currentScreenProps?.convertAirtimeState || { network: 'MTN', amount: 1000, receiveAmount: 800 };

  useEffect(() => {
    const tx = {
      id: genTxId(),
      type: 'airtime-to-cash' as const,
      amount: receiveAmount,
      date: new Date().toISOString(),
      status: 'completed' as const,
      details: {
        network,
        amount,
      }
    };
    setState({
      ...state,
      walletBalance: state.walletBalance + tx.amount,
      transactions: [tx, ...state.transactions],
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-20 h-20 bg-[#112F20] rounded-full flex items-center justify-center mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#AAFF45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 className="text-2xl font-medium mb-2">Airtime Converted</h1>
        <div className="text-4xl font-bold text-[#AAFF45] mb-8 animate-pulse">{fmt(receiveAmount)}</div>

        <div className="bg-[#0C2318] p-5 rounded-2xl border border-[#143324] w-full text-left">
          <div className="flex justify-between items-center py-2 border-b border-[#143324]">
            <span className="text-[#5A8870] text-sm">Transaction ID</span>
            <span className="text-[#F0FAF0] text-sm font-mono">{genTxId()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#143324]">
            <span className="text-[#5A8870] text-sm">Airtime Given</span>
            <span className="text-[#F0FAF0] text-sm">{fmt(amount)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#143324]">
            <span className="text-[#5A8870] text-sm">Network</span>
            <span className="text-[#F0FAF0] text-sm">{network}</span>
          </div>
          {state.linkedBank && (
            <div className="flex justify-between items-center py-2">
              <span className="text-[#5A8870] text-sm">Paid To</span>
              <span className="text-[#F0FAF0] text-sm">{state.linkedBank.bank}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-6">
        <button onClick={() => go('history')} className="w-full py-4 text-[#AAFF45] font-medium border border-[#143324] rounded-xl hover:bg-[#112F20]">
          View History
        </button>
        <button onClick={() => go('dashboard')} className="w-full py-4 text-[#5A8870] font-medium hover:text-[#F0FAF0]">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
