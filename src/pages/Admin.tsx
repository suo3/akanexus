import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, Package, Layout, BarChart3, LogOut, 
  ArrowLeft, Search, MoreVertical, Shield, ShieldOff, Loader2, FileText, Play, Box, UserPlus, Eye, EyeOff, Link, GraduationCap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ComponentManager } from '@/components/admin/ComponentManager';
import { TemplateManager } from '@/components/admin/TemplateManager';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { DocumentationManager } from '@/components/admin/DocumentationManager';
import { TutorialManager } from '@/components/admin/TutorialManager';
import CommunityTutorialManager from '@/components/admin/CommunityTutorialManager';
import ProductManager from '@/components/admin/ProductManager';
import BlogManager from '@/components/admin/BlogManager';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    action: 'promote' | 'demote';
    userName: string;
  }>({ open: false, userId: '', action: 'promote', userName: '' });
  
  // Create user dialog state
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchUserRoles();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setUsers(data);
    }
    setLoadingUsers(false);
  };

  const fetchUserRoles = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id, role');
    
    if (!error && data) {
      setUserRoles(data as UserRole[]);
    }
  };

  const getUserRole = (userId: string): 'admin' | 'moderator' | 'user' | null => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || null;
  };

  const handlePromoteToAdmin = async (userId: string) => {
    setUpdatingRole(userId);
    
    // Check if user already has a role entry
    const existingRole = userRoles.find(r => r.user_id === userId);
    
    if (existingRole) {
      // Update existing role
      const { error } = await (supabase
        .from('user_roles') as any)
        .update({ role: 'admin' })
        .eq('user_id', userId);
      
      if (error) {
        toast.error('Failed to promote user: ' + error.message);
      } else {
        toast.success('User promoted to admin');
        fetchUserRoles();
      }
    } else {
      // Insert new role
      const { error } = await (supabase
        .from('user_roles') as any)
        .insert({ user_id: userId, role: 'admin' });
      
      if (error) {
        toast.error('Failed to promote user: ' + error.message);
      } else {
        toast.success('User promoted to admin');
        fetchUserRoles();
      }
    }
    
    setUpdatingRole(null);
    setConfirmDialog({ open: false, userId: '', action: 'promote', userName: '' });
  };

  const handleDemoteFromAdmin = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("You can't demote yourself");
      return;
    }
    
    setUpdatingRole(userId);
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');
    
    if (error) {
      toast.error('Failed to demote user: ' + error.message);
    } else {
      toast.success('Admin role removed');
      fetchUserRoles();
    }
    
    setUpdatingRole(null);
    setConfirmDialog({ open: false, userId: '', action: 'demote', userName: '' });
  };

  const openConfirmDialog = (userId: string, action: 'promote' | 'demote', userName: string) => {
    setConfirmDialog({ open: true, userId, action, userName });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('Email and password are required');
      return;
    }
    
    if (newUserPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setCreatingUser(true);
    
    try {
      // Use Supabase Admin API via edge function
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: { 
          email: newUserEmail, 
          password: newUserPassword,
          fullName: newUserFullName 
        }
      });
      
      if (error) {
        toast.error('Failed to create user: ' + error.message);
      } else if (data?.error) {
        toast.error('Failed to create user: ' + data.error);
      } else {
        toast.success('User created successfully');
        setCreateUserDialog(false);
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserFullName('');
        fetchUsers();
      }
    } catch (err: any) {
      toast.error('Failed to create user: ' + (err.message || 'Unknown error'));
    }
    
    setCreatingUser(false);
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'components', label: 'Components', icon: Package },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'products', label: 'Products', icon: Box },
    { id: 'blog', label: 'Community Links', icon: Link },
    { id: 'community-tutorials', label: 'Community Tutorials', icon: GraduationCap },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'tutorials', label: 'Admin Tutorials', icon: Play },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border min-h-screen p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">Admin</span>
        </div>
        
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 mt-2"
            onClick={handleSignOut}
          >
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'users' && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">User Management</h1>
                <p className="text-muted-foreground">Manage registered users and their roles</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <Button onClick={() => setCreateUserDialog(true)}>
                  <UserPlus size={18} className="mr-2" />
                  Create User
                </Button>
              </div>
            </div>

            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((profile) => {
                      const role = getUserRole(profile.id);
                      const isCurrentUser = profile.id === user?.id;
                      const isUpdating = updatingRole === profile.id;
                      
                      return (
                        <tr key={profile.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-foreground block">
                                  {profile.full_name || 'Unknown'}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-xs text-muted-foreground">(You)</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{profile.email}</td>
                          <td className="px-6 py-4">
                            {role === 'admin' ? (
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                <Shield size={12} className="mr-1" />
                                Admin
                              </Badge>
                            ) : role === 'moderator' ? (
                              <Badge variant="secondary">Moderator</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">User</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" disabled={isUpdating}>
                                  {isUpdating ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <MoreVertical size={16} />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {role === 'admin' ? (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog(
                                      profile.id, 
                                      'demote', 
                                      profile.full_name || profile.email || 'this user'
                                    )}
                                    disabled={isCurrentUser}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <ShieldOff size={14} className="mr-2" />
                                    {isCurrentUser ? "Can't demote yourself" : 'Remove Admin'}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem 
                                    onClick={() => openConfirmDialog(
                                      profile.id, 
                                      'promote', 
                                      profile.full_name || profile.email || 'this user'
                                    )}
                                  >
                                    <Shield size={14} className="mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'components' && <ComponentManager />}

        {activeTab === 'templates' && <TemplateManager />}

        {activeTab === 'products' && <ProductManager />}

        {activeTab === 'blog' && <BlogManager />}

        {activeTab === 'community-tutorials' && <CommunityTutorialManager />}

        {activeTab === 'documentation' && <DocumentationManager />}

        {activeTab === 'tutorials' && <TutorialManager />}

        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => 
        setConfirmDialog(prev => ({ ...prev, open }))
      }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === 'promote' ? 'Promote to Admin?' : 'Remove Admin Role?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === 'promote' 
                ? `This will give ${confirmDialog.userName} full admin access to manage users, components, and templates.`
                : `This will remove admin privileges from ${confirmDialog.userName}. They will no longer be able to access the admin dashboard.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDialog.action === 'promote' 
                ? handlePromoteToAdmin(confirmDialog.userId)
                : handleDemoteFromAdmin(confirmDialog.userId)
              }
              className={confirmDialog.action === 'demote' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {confirmDialog.action === 'promote' ? 'Promote' : 'Remove Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create User Dialog */}
      <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account. They will be able to sign in with these credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newUserFullName">Full Name</Label>
              <Input
                id="newUserFullName"
                placeholder="John Doe"
                value={newUserFullName}
                onChange={(e) => setNewUserFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserEmail">Email *</Label>
              <Input
                id="newUserEmail"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserPassword">Password *</Label>
              <div className="relative">
                <Input
                  id="newUserPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={creatingUser}>
              {creatingUser ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
