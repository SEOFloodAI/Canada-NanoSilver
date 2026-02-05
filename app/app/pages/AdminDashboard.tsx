import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Key,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore, useAdminStore, useDistributorStore, useAffiliateStore, useForumStore, useAPIKeysStore, useResearchStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { users, orders, fetchUsers, fetchOrders, updateUserRole, updateUserMembership, deleteUser, updateOrderStatus } = useAdminStore();
  const { distributors, applications: distributorApplications, documents, fetchDistributors, approveApplication: approveDistributor, rejectApplication: rejectDistributor, deleteDocument } = useDistributorStore();
  const { affiliates, applications: affiliateApplications, commissions, fetchAffiliates, approveApplication: approveAffiliate, rejectApplication: rejectAffiliate, payCommission } = useAffiliateStore();
  const { topics, fetchTopics, deleteTopic } = useForumStore();
  const { apiKeys, fetchAPIKeys, addAPIKey, updateAPIKey, deleteAPIKey } = useAPIKeysStore();
  const { diseaseLibrary, addDiseaseEntry, updateDiseaseEntry, deleteDiseaseEntry } = useResearchStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  
  // Dialog states
  const [isAddingAPIKey, setIsAddingAPIKey] = useState(false);
  const [isAddingDisease, setIsAddingDisease] = useState(false);

  // Form states
  const [newAPIKey, setNewAPIKey] = useState({ name: '', service: 'openai' as const, key: '', usageLimit: '' });
  const [newDisease, setNewDisease] = useState({ name: '', category: 'viral' as const, description: '', searchTerms: '' });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      navigate('/');
      return;
    }
    fetchUsers();
    fetchOrders();
    fetchDistributors();
    fetchAffiliates();
    fetchTopics();
    fetchAPIKeys();
  }, [user, navigate, fetchUsers, fetchOrders, fetchDistributors, fetchAffiliates, fetchTopics, fetchAPIKeys]);

  // Stats
  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    activeDistributors: distributors.filter(d => d.status === 'approved').length,
    pendingDistributorApps: distributorApplications.filter(a => a.status === 'pending').length,
    activeAffiliates: affiliates.filter(a => a.status === 'active').length,
    pendingAffiliateApps: affiliateApplications.filter(a => a.status === 'pending').length,
    totalCommissions: commissions.reduce((sum, c) => sum + c.amount, 0),
    pendingPayouts: commissions.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
  };

  // Chart data
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ];

  const commissionData = [
    { name: 'Pending', value: commissions.filter(c => c.status === 'pending').length, color: '#fbbf24' },
    { name: 'Approved', value: commissions.filter(c => c.status === 'approved').length, color: '#3b82f6' },
    { name: 'Paid', value: commissions.filter(c => c.status === 'paid').length, color: '#22c55e' },
  ];

  const handleAddAPIKey = () => {
    addAPIKey({ 
      name: newAPIKey.name, 
      service: newAPIKey.service, 
      key: newAPIKey.key, 
      isActive: true,
      usageLimit: newAPIKey.usageLimit ? parseInt(newAPIKey.usageLimit) : undefined
    });
    setNewAPIKey({ name: '', service: 'openai', key: '', usageLimit: '' });
    setIsAddingAPIKey(false);
  };

  const handleAddDisease = () => {
    addDiseaseEntry({
      name: newDisease.name,
      category: newDisease.category,
      description: newDisease.description,
      searchTerms: newDisease.searchTerms.split(',').map(s => s.trim()),
      isActive: true,
      articleCount: 0,
    });
    setNewDisease({ name: '', category: 'viral', description: '', searchTerms: '' });
    setIsAddingDisease(false);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-orbitron text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage users, orders, distributors, affiliates, and system settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/30">
              {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
            </Badge>
            <Button variant="outline" onClick={logout} className="border-destructive/30 text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Users</p>
              <p className="text-xl font-bold text-primary">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Orders</p>
              <p className="text-xl font-bold text-accent">{stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(stats.totalRevenue).replace('.00', '')}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Distributors</p>
              <p className="text-xl font-bold text-primary">{stats.activeDistributors}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Dist. Apps</p>
              <p className="text-xl font-bold text-amber-400">{stats.pendingDistributorApps}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Affiliates</p>
              <p className="text-xl font-bold text-accent">{stats.activeAffiliates}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Aff. Apps</p>
              <p className="text-xl font-bold text-amber-400">{stats.pendingAffiliateApps}</p>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Commissions</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(stats.totalCommissions).replace('.00', '')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="distributors">Distributors</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="holographic-card">
                <CardHeader>
                  <CardTitle className="font-orbitron">Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="holographic-card">
                <CardHeader>
                  <CardTitle className="font-orbitron">Commission Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={commissionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {commissionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="font-orbitron">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={u.role}
                            onValueChange={(value: any) => updateUserRole(u.id, value)}
                            disabled={u.id === user.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              {user.role === 'superadmin' && <SelectItem value="superadmin">Super Admin</SelectItem>}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={u.membershipStatus}
                            onValueChange={(value: any) => updateUserMembership(u.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(u.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteUser(u.id)}
                            disabled={u.id === user.id}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="font-orbitron">Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value: any) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distributors Tab */}
          <TabsContent value="distributors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-orbitron text-xl font-semibold">Distributor Applications</h3>
            </div>
            
            <Card className="holographic-card">
              <CardContent className="p-0">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Territory</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributorApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <p className="font-medium">{app.businessName}</p>
                          <p className="text-sm text-muted-foreground">{app.businessType}</p>
                        </TableCell>
                        <TableCell>
                          <p>{app.contactName}</p>
                          <p className="text-sm text-muted-foreground">{app.email}</p>
                        </TableCell>
                        <TableCell>{app.territory}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => approveDistributor(app.id)} className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => rejectDistributor(app.id, 'Not a good fit')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mt-8">
              <h3 className="font-orbitron text-xl font-semibold">Distributor Documents</h3>
              <Button className="btn-holographic">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>

            <Card className="holographic-card">
              <CardContent className="p-0">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          {doc.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{doc.downloadCount}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteDocument(doc.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-orbitron text-xl font-semibold">Affiliate Applications</h3>
            </div>
            
            <Card className="holographic-card">
              <CardContent className="p-0">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Platforms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.socialMedia.map(s => s.platform).join(', ')}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => approveAffiliate(app.id)} className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => rejectAffiliate(app.id, 'Not a good fit')}>
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mt-8">
              <h3 className="font-orbitron text-xl font-semibold">Commissions</h3>
            </div>

            <Card className="holographic-card">
              <CardContent className="p-0">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell>{comm.affiliateId}</TableCell>
                        <TableCell className="font-mono">{comm.orderId}</TableCell>
                        <TableCell>{formatCurrency(comm.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={comm.status === 'pending' ? 'secondary' : comm.status === 'approved' ? 'default' : 'default'}>
                            {comm.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {comm.status === 'pending' && (
                            <Button size="sm" onClick={() => {/* approve */}}>Approve</Button>
                          )}
                          {comm.status === 'approved' && (
                            <Button size="sm" onClick={() => payCommission(comm.id)}>Pay</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum">
            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-orbitron">Distributor Forum</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Replies</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topics.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell>
                          <p className="font-medium">{topic.title}</p>
                          {topic.isPinned && <Badge className="mt-1">Pinned</Badge>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{topic.category}</Badge>
                        </TableCell>
                        <TableCell>{topic.authorName}</TableCell>
                        <TableCell>{topic.replies.length}</TableCell>
                        <TableCell>{topic.views}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteTopic(topic.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-orbitron text-xl font-semibold">SIVERS Disease Research Library</h3>
              <Button onClick={() => setIsAddingDisease(true)} className="btn-holographic">
                <Plus className="w-4 h-4 mr-2" />
                Add Disease Entry
              </Button>
            </div>
            
            <Card className="holographic-card">
              <CardContent className="p-0">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Search Terms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diseaseLibrary.map((disease) => (
                      <TableRow key={disease.id}>
                        <TableCell>
                          <p className="font-medium">{disease.name}</p>
                          <p className="text-sm text-muted-foreground">{disease.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{disease.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {disease.searchTerms.slice(0, 3).map((term, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-muted">{term}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => updateDiseaseEntry(disease.id, { isActive: !disease.isActive })}
                            className={`w-10 h-6 rounded-full transition-colors relative ${disease.isActive ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${disease.isActive ? 'left-5' : 'left-1'}`} />
                          </button>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => deleteDiseaseEntry(disease.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-orbitron text-xl font-semibold">API Keys Management</h3>
              <Button onClick={() => setIsAddingAPIKey(true)} className="btn-holographic">
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {apiKeys.map((key) => (
                <Card key={key.id} className="holographic-card">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${key.isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                          <Key className={`w-5 h-5 ${key.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p className="font-medium">{key.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">{key.service}</p>
                        </div>
                      </div>
                      <Badge variant={key.isActive ? 'default' : 'secondary'}>
                        {key.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Input
                        type={showApiKey === key.id ? 'text' : 'password'}
                        value={key.key}
                        readOnly
                        className="input-holographic font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                      >
                        {showApiKey === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Usage: {key.usageCount}{key.usageLimit ? ` / ${key.usageLimit}` : ''}</span>
                      <span>Last used: {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateAPIKey(key.id, { isActive: !key.isActive })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          key.isActive ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {key.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAPIKey(key.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add API Key Dialog */}
        <Dialog open={isAddingAPIKey} onOpenChange={setIsAddingAPIKey}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-orbitron">Add API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input value={newAPIKey.name} onChange={(e) => setNewAPIKey({ ...newAPIKey, name: e.target.value })} className="input-holographic" placeholder="e.g., OpenAI Production" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Service</label>
                <Select value={newAPIKey.service} onValueChange={(v: any) => setNewAPIKey({ ...newAPIKey, service: v })}>
                  <SelectTrigger className="input-holographic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google AI</SelectItem>
                    <SelectItem value="pubmed">PubMed</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">API Key</label>
                <Input type="password" value={newAPIKey.key} onChange={(e) => setNewAPIKey({ ...newAPIKey, key: e.target.value })} className="input-holographic" placeholder="Enter API key" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Usage Limit (optional)</label>
                <Input type="number" value={newAPIKey.usageLimit} onChange={(e) => setNewAPIKey({ ...newAPIKey, usageLimit: e.target.value })} className="input-holographic" placeholder="e.g., 1000" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingAPIKey(false)}>Cancel</Button>
              <Button onClick={handleAddAPIKey} className="btn-holographic">Add Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Disease Dialog */}
        <Dialog open={isAddingDisease} onOpenChange={setIsAddingDisease}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-orbitron">Add Disease Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Disease Name</label>
                <Input value={newDisease.name} onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })} className="input-holographic" placeholder="e.g., COVID-19" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={newDisease.category} onValueChange={(v: any) => setNewDisease({ ...newDisease, category: v })}>
                  <SelectTrigger className="input-holographic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viral">Viral</SelectItem>
                    <SelectItem value="bacterial">Bacterial</SelectItem>
                    <SelectItem value="parasitic">Parasitic</SelectItem>
                    <SelectItem value="fungal">Fungal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input value={newDisease.description} onChange={(e) => setNewDisease({ ...newDisease, description: e.target.value })} className="input-holographic" placeholder="Brief description" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Search Terms (comma separated)</label>
                <Input value={newDisease.searchTerms} onChange={(e) => setNewDisease({ ...newDisease, searchTerms: e.target.value })} className="input-holographic" placeholder="e.g., SARS-CoV-2, coronavirus, COVID" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingDisease(false)}>Cancel</Button>
              <Button onClick={handleAddDisease} className="btn-holographic">Add Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
