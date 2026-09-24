import React, { useState } from 'react';
import { X, DollarSign, Wallet, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, History } from 'lucide-react';
import { adService } from '../../services/adService';
import { PayoutRequest } from '../../types/monetization.types';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'paypal' | 'bank_transfer' | 'stripe' | 'crypto_usdt'>('paypal');
  const [amount, setAmount] = useState('50.00');
  const [accountDetails, setAccountDetails] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const metrics = adService.getMetrics();
  const payouts = adService.getPayouts();

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 20) {
      setError('El monto mínimo para cobrar es $20.00 USD');
      return;
    }

    if (parsedAmount > metrics.unpaidBalance) {
      setError(`Monto superior a tu saldo disponible ($${metrics.unpaidBalance.toFixed(2)} USD)`);
      return;
    }

    if (!accountDetails.trim()) {
      setError('Por favor ingresa los datos de cobro (correo PayPal, IBAN o billetera)');
      return;
    }

    const res = adService.requestPayout(parsedAmount, method, accountDetails.trim());
    if (res.success) {
      onSuccess(res.message);
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#121622] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Retiro de Ingresos por Anuncios</h3>
              <p className="text-[11px] text-slate-400">Cobro de ganancias publicitarias (AdMob / AdSense)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Balance card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-[#121622] to-slate-900 border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
              <span>Saldo Disponible para Retirar</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fondos Auditados</span>
              </span>
            </div>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              <span>${metrics.unpaidBalance.toFixed(2)}</span>
              <span className="text-xs font-semibold text-slate-400">USD</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Total acumulado histórico: ${metrics.estimatedRevenue.toFixed(2)} USD • eCPM medio: ${metrics.ecpmAvg.toFixed(2)}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('paypal')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'paypal'
                      ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('bank_transfer')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'bank_transfer'
                      ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Transferencia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('stripe')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'stripe'
                      ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Stripe Connect</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('crypto_usdt')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    method === 'crypto_usdt'
                      ? 'bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>USDT (TRC20)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Monto a Retirar (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="20"
                  max={metrics.unpaidBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-16 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00F2FE]"
                  placeholder="50.00"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(metrics.unpaidBalance.toFixed(2))}
                  className="absolute right-2 top-2 px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white"
                >
                  Máx
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Mínimo: $20.00 USD</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {method === 'paypal' && 'Correo de tu cuenta PayPal'}
                {method === 'bank_transfer' && 'Número de Cuenta / CLABE / IBAN + Beneficiario'}
                {method === 'stripe' && 'Correo registrado en Stripe'}
                {method === 'crypto_usdt' && 'Billetera USDT (Red TRC-20 o BEP-20)'}
              </label>
              <input
                type="text"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder={
                  method === 'paypal'
                    ? 'ejemplo@correo.com'
                    : method === 'crypto_usdt'
                    ? 'T9yD14Nj9j7xAB4...'
                    : '18 dígitos o cuenta bancaria'
                }
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00F2FE]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={metrics.unpaidBalance < 20}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Solicitar Retiro de Fondos</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

          {/* Past Payouts History */}
          <div className="pt-3 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
              <History className="w-3.5 h-3.5" />
              <span>Historial de Cobros Recientes</span>
            </h4>

            {payouts.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-2">No hay cobros previos registrados.</p>
            ) : (
              <div className="space-y-2">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>${p.amount.toFixed(2)} USD</span>
                        <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/10 text-slate-300">
                          {p.method}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{p.accountDetails}</span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {p.status === 'completed' ? 'Pagado' : 'Pendiente'}
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{p.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
