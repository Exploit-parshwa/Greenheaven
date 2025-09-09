import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  MoreHorizontal,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  repliedAt?: string;
  assignedTo?: string;
}

export default function AdminEnquiry() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91-9876543210',
      subject: 'Plant Care Instructions',
      message: 'I recently purchased a Monstera from your store and would like detailed care instructions.',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-23T10:30:00Z',
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      subject: 'Delivery Issue',
      message: 'My order was supposed to arrive yesterday but I have not received it yet. Order #PL123456',
      status: 'replied',
      priority: 'high',
      createdAt: '2024-01-22T14:15:00Z',
      repliedAt: '2024-01-22T16:20:00Z',
      assignedTo: 'Support Team'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+91-9876543211',
      subject: 'Bulk Order Inquiry',
      message: 'I am interested in placing a bulk order for 50+ plants for my office. Can you provide a quote?',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-01-21T09:45:00Z',
      repliedAt: '2024-01-21T11:30:00Z',
      assignedTo: 'Sales Team'
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily@example.com',
      subject: 'Plant Recommendation',
      message: 'Can you recommend some low-light plants for my apartment? I am a beginner.',
      status: 'pending',
      priority: 'low',
      createdAt: '2024-01-23T08:20:00Z',
    },
    {
      id: '5',
      name: 'David Kumar',
      email: 'david@example.com',
      phone: '+91-9876543212',
      subject: 'Refund Request',
      message: 'I received a damaged plant and would like to request a refund. Order #PL123457',
      status: 'replied',
      priority: 'high',
      createdAt: '2024-01-20T16:10:00Z',
      repliedAt: '2024-01-20T17:45:00Z',
      assignedTo: 'Admin'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || enquiry.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'replied': return <MessageCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const updateEnquiryStatus = (enquiryId: string, newStatus: Enquiry['status']) => {
    setEnquiries(prev => prev.map(enquiry => 
      enquiry.id === enquiryId 
        ? { 
            ...enquiry, 
            status: newStatus,
            repliedAt: newStatus === 'replied' ? new Date().toISOString() : enquiry.repliedAt
          }
        : enquiry
    ));
  };

  const sendReply = () => {
    if (selectedEnquiry && replyText.trim()) {
      updateEnquiryStatus(selectedEnquiry.id, 'replied');
      setReplyText('');
      setSelectedEnquiry(null);
      // Here you would typically send the actual reply via email
      alert('Reply sent successfully!');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
            <p className="text-gray-600">Manage customer inquiries and support requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enquiries.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {enquiries.filter(e => e.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {enquiries.filter(e => e.priority === 'high').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {enquiries.filter(e => e.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search enquiries by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="flex gap-1">
                  {['all', 'pending', 'replied', 'resolved', 'closed'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  {['all', 'high', 'medium', 'low'].map((priority) => (
                    <Button
                      key={priority}
                      variant={priorityFilter === priority ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPriorityFilter(priority)}
                      className={priority !== 'all' ? `border-${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'}-300` : ''}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Customer Enquiries</span>
              <Badge variant="secondary">{filteredEnquiries.length} enquiries</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{enquiry.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{enquiry.email}</span>
                          </div>
                          {enquiry.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{enquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{enquiry.subject}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {enquiry.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(enquiry.priority)}>
                          {enquiry.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(enquiry.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(enquiry.status)}
                            <span>{enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(enquiry.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enquiry)}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Enquiry Details</DialogTitle>
                              </DialogHeader>
                              {selectedEnquiry && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="font-medium">Customer Name</label>
                                      <p>{selectedEnquiry.name}</p>
                                    </div>
                                    <div>
                                      <label className="font-medium">Email</label>
                                      <p>{selectedEnquiry.email}</p>
                                    </div>
                                    {selectedEnquiry.phone && (
                                      <div>
                                        <label className="font-medium">Phone</label>
                                        <p>{selectedEnquiry.phone}</p>
                                      </div>
                                    )}
                                    <div>
                                      <label className="font-medium">Priority</label>
                                      <Badge className={getPriorityColor(selectedEnquiry.priority)}>
                                        {selectedEnquiry.priority.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="font-medium">Subject</label>
                                    <p>{selectedEnquiry.subject}</p>
                                  </div>
                                  
                                  <div>
                                    <label className="font-medium">Message</label>
                                    <div className="p-3 bg-gray-50 rounded border">
                                      {selectedEnquiry.message}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="font-medium">Reply</label>
                                    <Textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Type your reply here..."
                                      rows={4}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'resolved')}
                                    >
                                      Mark Resolved
                                    </Button>
                                    <Button onClick={sendReply}>
                                      Send Reply
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, 'replied')}>
                                Mark as Replied
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, 'resolved')}>
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, 'closed')}>
                                Close Enquiry
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredEnquiries.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No enquiries found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
