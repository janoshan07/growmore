import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { FiUsers, FiActivity, FiTrendingUp, FiShield, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const fetchStats = async () => { const { data } = await api.get('/admin/stats'); return data.data; };
const fetchUsers = async () => { const { data } = await api.get('/admin/users'); return data.data; };

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
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers },
    { label: 'Total Trades', value: stats?.totalTransactions || 0, icon: FiActivity },
    { label: 'Buy Orders', value: stats?.buyCount || 0, icon: FiTrendingUp },
    { label: 'Sell Orders', value: stats?.sellCount || 0, icon: FiShield },
  ];

  return (
    <div className="min-h-screen bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <FiShield className="text-purple-400 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Platform management & analytics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <motion.div key={s.label} whileHover={{ y: -2 }} className="stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
                <s.icon className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">{s.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Trade Volume */}
        <div className="card mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Total Trade Volume</p>
          <p className="text-4xl font-bold font-mono text-purple-400 mt-1">
            ${(stats?.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Users Table */}
        <div className="card">
          <h2 className="font-bold text-white mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left pb-3 font-medium">Name</th>
                  <th className="text-left pb-3 font-medium">Email</th>
                  <th className="text-left pb-3 font-medium">Role</th>
                  <th className="text-right pb-3 font-medium">Balance</th>
                  <th className="text-left pb-3 font-medium">Joined</th>
                  <th className="text-center pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {users?.map((u) => (
                  <tr key={u._id} className="hover:bg-dark-200/50">
                    <td className="py-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 text-gray-400">{u.email}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-primary-400">
                      ${u.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => toggleUser(u._id, u.name)}
                        className={`flex items-center gap-1 mx-auto text-xs px-3 py-1 rounded-full transition-all ${u.isActive ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400'}`}
                      >
                        {u.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
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
