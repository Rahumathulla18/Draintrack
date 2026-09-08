import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Building2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Payment, PaymentStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface PaymentsPageProps {
  payments: Payment[];
  onApprovePayment: (paymentId: string) => void;
  onMarkAsPaid: (paymentId: string) => void;
  onRejectPayment?: (paymentId: string) => void;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  payments = [],
  onApprovePayment,
  onMarkAsPaid,
  onRejectPayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.worker_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.job_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPaid = payments
    .filter((p) => p.payment_status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = payments
    .filter((p) => p.payment_status === 'Pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalApproved = payments
    .filter((p) => p.payment_status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div id="admin-payments-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Worker Work Records &amp; Municipal Payment Approvals</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-backed verified work claims and administrative payment clearance records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
            Paid: ₹{totalPaid.toLocaleString()}
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-semibold">
            Approved: ₹{totalApproved.toLocaleString()}
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold">
            Pending: ₹{totalPending.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Municipal Workflow Explanatory Notice */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
        <div className="flex items-center gap-2 font-bold text-blue-900">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Statutory Municipal Payment Protocol:</span>
        </div>
        <p className="text-[11px] text-blue-800 leading-relaxed pl-6">
          The system does <strong>not</strong> independently determine government salary. It creates verified work records that can be reviewed and approved by an authorized municipal/government authority.
          Payments follow the official sequence: <strong>Pending &rarr; Approved &rarr; Paid</strong> (or <strong>Rejected</strong> if audit criteria are not satisfied).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payments by ID, worker name, job ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium"
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Paid">Paid</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Sanitation Worker</th>
                <th className="py-3 px-4">Job ID &amp; Location</th>
                <th className="py-3 px-4">Sanction Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.payment_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{p.payment_id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{p.worker_name}</div>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {p.worker_code}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="font-mono font-semibold text-slate-800">{p.job_id}</div>
                    <div className="text-[11px] text-slate-500 truncate">{p.location_name}</div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={p.payment_status} type="payment" size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {p.approved_by ? (
                      <div>
                        <div className="font-medium text-slate-900">{p.approved_by}</div>
                        <div className="text-[10px] text-slate-400">Municipal Authority</div>
                      </div>
                    ) : (
                      <span className="text-amber-600 italic font-medium">Awaiting Review</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{p.created_at}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Approve Payment button */}
                      {p.payment_status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprovePayment(p.payment_id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-xs"
                            title="Approve work payment"
                          >
                            Approve
                          </button>
                          {onRejectPayment && (
                            <button
                              type="button"
                              onClick={() => onRejectPayment(p.payment_id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] shadow-xs"
                              title="Reject payment claim"
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}

                      {/* Mark as Paid button */}
                      {p.payment_status === 'Approved' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onMarkAsPaid(p.payment_id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs"
                            title="Confirm payment completed"
                          >
                            Mark as Paid
                          </button>
                          {onRejectPayment && (
                            <button
                              type="button"
                              onClick={() => onRejectPayment(p.payment_id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] shadow-xs"
                              title="Revoke and reject payment"
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}

                      {p.payment_status === 'Paid' && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid</span>
                        </span>
                      )}

                      {p.payment_status === 'Rejected' && (
                        <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
