import { Search, Filter, Plus, Edit, Trash2, Shield, UserCheck, UserX, X } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, adminApi } from '@/services';
import { PageLoader } from '@/components/common/Loader';
import { useState } from 'react';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'VENDOR', 'CUSTOMER', 'DELIVERY_PARTNER'];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', { search: searchTerm, role: roleFilter === 'ALL' ? undefined : roleFilter }],
    queryFn: () => adminApi.get('/users', {
      params: {
        search: searchTerm,
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        limit: 50
      }
    }),
  });

  const users = usersData?.data?.users || usersData?.users || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    },
  });

  const handleDelete = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEO title="User Management" />
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">User Management</h2>
            <p className="text-sm text-slate-500">Manage all platform users</p>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-primary-500 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>{role.replace('_', ' ')}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-surface-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                          {user.firstName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-xs font-medium ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(user)} className="rounded-lg p-2 text-slate-500 hover:bg-surface-100 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-surface-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 text-center text-slate-500">
                <p>User form coming soon. This will allow adding/editing users with all fields.</p>
                <p className="text-sm mt-2">For now, use the backend API directly or seed data.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
