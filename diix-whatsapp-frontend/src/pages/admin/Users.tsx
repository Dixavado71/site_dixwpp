import { motion } from 'framer-motion'
import { Users, Search, Edit2, Trash2, Eye, Plus, CreditCard, UserCheck, UserX, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { UserModal } from '@/components/modals/UserModal'
import { useUsersStore } from '@/stores/usersStore'
import { useModal } from '@/hooks/useModal'
import type { User } from '@/types'

export default function AdminUsers() {
  const { users, isLoading, fetchUsers, toggleUserStatus, deleteUser } = useUsersStore()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modais
  const deleteConfirmModal = useModal()
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats calculations
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const inactiveUsers = users.filter(u => u.status !== 'active').length
  const adminUsers = users.filter(u => u.role === 'super_admin' || u.role === 'admin-global').length

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatus(user.id)
    } catch (error) {
      // Erro já tratado no store
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      await deleteUser(selectedUser.id)
      deleteConfirmModal.close()
      setSelectedUser(null)
    } catch (error) {
      // Erro já tratado no store
    }
  }

  const openCreateModal = () => {
    setSelectedUser(null)
    setModalMode('create')
  }

  const openViewModal = (user: User) => {
    setSelectedUser(user)
    setModalMode('view')
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setModalMode('edit')
  }

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user)
    deleteConfirmModal.open()
  }

  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Gestão de Usuários</h1>
          <p className="text-text-muted mt-1">Gerencie todos os usuários do sistema</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Usuários</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{totalUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{activeUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Usuários Inativos</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{inactiveUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
                <UserX className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Admins</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{adminUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Usuários</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  placeholder="Buscar usuário..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-text-muted mb-4" />
                <p className="text-text-secondary">Nenhum usuário encontrado</p>
                <p className="text-sm text-text-muted mt-1">
                  {searchTerm ? 'Tente buscar por outro termo' : 'Crie o primeiro usuário para começar'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Usuário</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Tenant</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-text-muted">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-accent-primary/5 transition-colors">
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-secondary to-accent-cyan flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-text-primary">{user.email}</div>
                              <div className="text-xs text-text-muted">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            user.role === 'super_admin' || user.role === 'admin-global'
                              ? 'bg-accent-primary/10 text-accent-primary'
                              : 'bg-accent-secondary/10 text-accent-secondary'
                          }`}>
                            {user.role === 'super_admin' || user.role === 'admin-global' ? 'Super Admin' : 'Admin'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-secondary">
                          {user.tenantId || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <StatusBadge status={user.status || 'active'} />
                        </td>
                        <td className="py-3 px-4 text-sm text-right space-x-2">
                          <button
                            onClick={() => openViewModal(user)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
                            title={user.status === 'active' ? 'Suspender' : 'Ativar'}
                          >
                            <CreditCard className={`w-4 h-4 ${user.status === 'active' ? 'text-yellow-500' : 'text-green-500'}`} />
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(user)}
                            className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => {
          deleteConfirmModal.close()
          setSelectedUser(null)
        }}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${selectedUser?.email}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
      />

      {/* Modal de Criar/Editar/Visualizar Usuário */}
      {modalMode && (
        <UserModal
          mode={modalMode}
          user={selectedUser ?? undefined}
          open={!!modalMode}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
