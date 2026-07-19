import React from 'react';
import { ScreenProps } from '@/types';
import { fmt } from '@/data';
import {
  IconSettings,
  IconLogOut,
  IconSignal,
  IconPhone,
  IconWifi,
  IconZap,
  IconArrowRight,
} from '@/components';

export function Dashboard({ go, state, setState, requestPin }: ScreenProps) {
  const earned = state.transactions
    .filter(t => t.type === 'data-to-cash' || t.type === 'airtime-to-cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTxs = state.transactions.slice(0, 4);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-[#030F07] text-[#F0FAF0] min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Good afternoon, {state.userName}</h1>
        <div className="flex gap-4">
          <button onClick={() => go('settings')} className="p-2 bg-[#0C2318] rounded-full">
            <IconSettings />
          </button>
          <button onClick={() => go('splash')} className="p-2 bg-[#0C2318] rounded-full">
            <IconLogOut />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0C2318] to-[#0A1A12] rounded-2xl p-6 mb-6 shadow-lg border border-[#143324]">
        <div className="text-[#7AAD8A] text-sm mb-1">Wallet Balance</div>
        <div className="text-[42px] font-bold text-[#AAFF45] mb-4">{fmt(state.walletBalance)}</div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-[#5A8870] text-xs">Total Earned</div>
            <div className="text-[#F0FAF0] text-sm font-medium">{fmt(earned)}</div>
          </div>
          <button 
            onClick={() => go('fund-wallet')}
            className="px-4 py-2 border border-[#AAFF45] text-[#AAFF45] rounded-full text-sm font-medium"
          >
            Fund Wallet
          </button>
        </div>
        {state.linkedBank && (
          <div className="text-[#5A8870] text-xs pt-4 border-t border-[#143324]">
            Linked: {state.linkedBank.bank} •••• {state.linkedBank.last4}
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <div className="px-3 py-1 bg-[#0C2318] text-[#AAFF45] rounded-full text-xs font-medium border border-[#143324]">
          MTN Network
        </div>
        <div className="px-3 py-1 bg-[#0C2318] text-[#AAFF45] rounded-full text-xs font-medium border border-[#143324]">
          KYC Verified
        </div>
      </div>

      <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <ActionCard
          icon={<IconSignal color="#AAFF45" />}
          title="Convert Data"
          desc="Data to Cash"
          onClick={() => go('convert-data-detect')}
        />
        <ActionCard
          icon={<IconPhone color="#AAFF45" />}
          title="Convert Airtime"
          desc="Airtime to Cash"
          onClick={() => go('convert-airtime')}
        />
        <ActionCard
          icon={<IconWifi color="#AAFF45" />}
          title="Buy Data"
          desc="Top up data"
          onClick={() => go('buy-data')}
        />
        <ActionCard
          icon={<IconZap color="#AAFF45" />}
          title="Buy Airtime"
          desc="Top up airtime"
          onClick={() => go('buy-airtime')}
        />
      </div>

      <div className="bg-[#0C2318] rounded-xl p-4 mb-6 border border-[#143324]">
        <h3 className="text-sm text-[#7AAD8A] mb-3 font-medium">Current Rates</h3>
        <div className="flex justify-between text-sm">
          <div className="text-[#F0FAF0]">SME <span className="text-[#AAFF45]">₦650/GB</span></div>
          <div className="text-[#F0FAF0]">Regular <span className="text-[#AAFF45]">₦500/GB</span></div>
          <div className="text-[#F0FAF0]">Promo <span className="text-[#AAFF45]">₦350/GB</span></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        <button onClick={() => go('history')} className="text-[#AAFF45] text-sm flex items-center gap-1">
          View all <IconArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {recentTxs.map(tx => (
          <div key={tx.id} className="bg-[#0C2318] p-3 rounded-xl flex justify-between items-center border border-[#143324]">
            <div>
              <div className="text-sm font-medium text-[#F0FAF0]">
                {tx.type === 'data-to-cash' ? `SME ${tx.details?.bundle || 'Data'}` :
                 tx.type === 'airtime-to-cash' ? `Airtime ₦${tx.details?.amount || 0}` :
                 tx.type === 'buy-data' ? `Bought ${tx.details?.bundle || 'Data'}` :
                 tx.type === 'buy-airtime' ? `Sent ₦${tx.details?.amount || 0} airtime` :
                 'Funded wallet'}
              </div>
              <div className="text-xs text-[#5A8870]">{new Date(tx.date).toLocaleDateString()}</div>
            </div>
            <div className={`font-medium ${['data-to-cash', 'airtime-to-cash', 'fund-wallet'].includes(tx.type) ? (tx.type === 'fund-wallet' ? 'text-blue-400' : 'text-[#AAFF45]') : 'text-red-400'}`}>
              {['data-to-cash', 'airtime-to-cash', 'fund-wallet'].includes(tx.type) ? '+' : '-'}{fmt(tx.amount)}
            </div>
          </div>
        ))}
        {recentTxs.length === 0 && (
          <div className="text-center text-[#5A8870] py-4 text-sm">No recent transactions</div>
        )}
      </div>

      <div className="bottom-nav-spacer h-24" />
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick }: any) {
  return (
    <button onClick={onClick} className="bg-[#0C2318] p-4 rounded-xl flex flex-col items-start border border-[#143324] hover:bg-[#112F20] transition-colors text-left">
      <div className="bg-[#030F07] p-2 rounded-lg mb-3">
        {icon}
      </div>
      <div className="text-[#F0FAF0] font-medium text-sm mb-1">{title}</div>
      <div className="text-[#5A8870] text-xs flex justify-between w-full items-center">
        <span>{desc}</span>
        <IconArrowRight size={14} color="#5A8870" />
      </div>
    </button>
  );
}
