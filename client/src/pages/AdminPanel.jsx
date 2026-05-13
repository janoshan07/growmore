import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { FiUsers, FiActivity, FiTrendingUp, FiShield, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const fetchStats = async () => { const { data } = await api.get('/admin/stats'); return data.data; };
const fetchUsers = async () => { const { data } = await api.get('/admin/users'); return data.data; };

// ─── Shared panel style ───────────────────────────────────────────────────────
const panel = {
  background: 'linear-gradient(160deg, #071a2e 0%, #0a2240 100%)',
  border: '1px solid rgba(0,229,255,0.18)',
  borderRadius: 18,
  padding: '22px 24px',
};

export default function AdminPanel() {
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats });
  const { data: users, refetch } = useQuery({ queryKey: ['admin-users'], queryFn: fetchUsers });

  const toggleUser = async (id, name) => {
    try {
      await api.put(`/admin/users/${id}/toggle`);
      toast.success(`User ${name} status updated`);
      refetch();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const statCards = [
    { label: 'Total Users',  value: stats?.totalUsers        || 0, icon: FiUsers,     color: '#00e5ff' },
    { label: 'Total Trades', value: stats?.totalTransactions || 0, icon: FiActivity,  color: '#00e5ff' },
    { label: 'Buy Orders',   value: stats?.buyCount          || 0, icon: FiTrendingUp, color: '#4ade80' },
    { label: 'Sell Orders',  value: stats?.sellCount         || 0, icon: FiShield,    color: '#f87171' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#040f1c' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiShield style={{ color: '#a78bfa', width: 20, height: 20 }} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#e0f7fa', margin: 0 }}>Admin Panel</h1>
            <p style={{ fontSize: 13, color: '#7ecfda', margin: 0, marginTop: 2 }}>Platform management & analytics</p>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, boxShadow: '0 0 20px rgba(0,229,255,0.1)' }}
              style={{
                background: 'linear-gradient(145deg, #071a2e 0%, #0a2240 100%)',
                border: '1px solid rgba(0,229,255,0.18)',
                borderRadius: 16,
                padding: '18px 20px',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 10, color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{s.label}</p>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon style={{ color: s.color, width: 14, height: 14 }} />
                </div>
              </div>
              <p style={{ fontSize: 28, fontWeight: 800, fontFamily: 'monospace', color: '#e0f7fa', margin: '8px 0 0' }}>
                {s.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Trade Volume ── */}
        <div style={{ ...panel, marginBottom: 20 }}>
          <p style={{ fontSize: 10, color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Total Trade Volume</p>
          <p style={{ fontSize: 36, fontWeight: 800, fontFamily: 'monospace', color: '#a78bfa', margin: '6px 0 0' }}>
            ${(stats?.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* ── Users Table ── */}
        <div style={panel}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e0f7fa', margin: '0 0 18px' }}>All Users</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Balance', 'Joined', 'Status'].map((h, i) => (
                    <th key={h} style={{
                      padding: '0 0 12px',
                      textAlign: i === 3 ? 'right' : i === 5 ? 'center' : 'left',
                      fontSize: 10, fontWeight: 600,
                      color: '#7ecfda', textTransform: 'uppercase', letterSpacing: '0.08em',
                      borderBottom: '1px solid rgba(0,229,255,0.12)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(0,229,255,0.06)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 700, color: '#e0f7fa' }}>{u.name}</td>
                    <td style={{ padding: '12px 0', color: '#7ecfda' }}>{u.email}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                        background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(0,229,255,0.1)',
                        border: `1px solid ${u.role === 'admin' ? 'rgba(139,92,246,0.35)' : 'rgba(0,229,255,0.2)'}`,
                        color: u.role === 'admin' ? '#a78bfa' : '#00e5ff',
                        textTransform: 'uppercase',
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontFamily: 'monospace', color: '#00e5ff', fontWeight: 600 }}>
                      ${u.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 0', color: '#7ecfda', fontSize: 11 }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'center' }}>
                      <button
                        onClick={() => toggleUser(u._id, u.name)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                          cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                          background: u.isActive ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                          color: u.isActive ? '#4ade80' : '#f87171',
                          outline: `1px solid ${u.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                        }}
                      >
                        {u.isActive
                          ? <FiToggleRight style={{ width: 14, height: 14 }} />
                          : <FiToggleLeft  style={{ width: 14, height: 14 }} />}
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
