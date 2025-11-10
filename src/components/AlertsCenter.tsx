import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Bell, Send, Mail, MessageSquare, Users, Clock } from 'lucide-react';
import { mockAlerts, mockMessages } from '../data/mockData';
import { Alert } from '../types';
import { toast } from 'sonner@2.0.3';

export function AlertsCenter() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [messages, setMessages] = useState(mockMessages);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('All Staff');

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'SMS':
        return MessageSquare;
      case 'Email':
        return Mail;
      case 'Broadcast':
        return Bell;
      default:
        return Bell;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800';
      case 'Email':
        return 'bg-purple-100 text-purple-800';
      case 'Broadcast':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const message = {
      id: `M${String(messages.length + 1).padStart(3, '0')}`,
      sender: 'You',
      recipient: selectedRecipient,
      message: newMessage,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isRead: false,
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    toast.success('Message sent successfully');
  };

  const ComposeAlertForm = ({ onSend }: { onSend: (data: Partial<Alert>) => void }) => {
    const [formData, setFormData] = useState<Partial<Alert>>({
      title: '',
      message: '',
      type: 'Email',
      recipients: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSend(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="alert-title">Alert Title *</Label>
          <Input
            id="alert-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter alert title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alert-message">Message *</Label>
          <Textarea
            id="alert-message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your message here..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="alert-type">Delivery Method *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="alert-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Broadcast">Broadcast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alert-recipients">Recipients *</Label>
            <Select
              value={formData.recipients}
              onValueChange={(value) => setFormData({ ...formData, recipients: value })}
            >
              <SelectTrigger id="alert-recipients">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Staff">All Staff</SelectItem>
                <SelectItem value="All Volunteers">All Volunteers</SelectItem>
                <SelectItem value="Warehouse Managers">Warehouse Managers</SelectItem>
                <SelectItem value="Field Coordinators">Field Coordinators</SelectItem>
                <SelectItem value="Admins">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Send Alert
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-100 mb-2">Alerts & Communication</h1>
          <p className="text-gray-400">Send alerts and communicate with team members</p>
        </div>
        <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Compose Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose New Alert</DialogTitle>
              <DialogDescription>
                Send an alert to selected recipients via email, SMS, or broadcast
              </DialogDescription>
            </DialogHeader>
            <ComposeAlertForm
              onSend={(data) => {
                const newAlert: Alert = {
                  id: `A${String(alerts.length + 1).padStart(3, '0')}`,
                  title: data.title!,
                  message: data.message!,
                  type: data.type!,
                  recipients: data.recipients!,
                  timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                  status: 'Sent',
                  sender: 'You',
                };
                setAlerts([newAlert, ...alerts]);
                setIsComposeDialogOpen(false);
                toast.success('Alert sent successfully');
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <Card className="lg:col-span-2 border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-100">Quick Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Send to:</Label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger id="recipient">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Staff">All Staff</SelectItem>
                    <SelectItem value="Warehouse Team">Warehouse Team</SelectItem>
                    <SelectItem value="Field Coordinators">Field Coordinators</SelectItem>
                    <SelectItem value="Volunteers">Volunteers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages List */}
            <ScrollArea className="h-96 border border-gray-200 rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.sender === 'You'
                        ? 'bg-blue-950/30 border border-blue-900/50 ml-8'
                        : 'bg-gray-800 border border-gray-700 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'You'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-white'
                          }`}
                        >
                          {message.sender.charAt(0)}
                        </div>
                        <div>
                          <p className="text-gray-100">{message.sender}</p>
                          <p className="text-gray-400">
                            To: {message.recipient}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-200">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Alert Stats */}
        <div className="space-y-6">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-gray-100">Alert Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-950/30 rounded-lg border border-blue-900/50">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-100">SMS Alerts</span>
                </div>
                <span className="text-gray-100">
                  {alerts.filter((a) => a.type === 'SMS').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-950/30 rounded-lg border border-purple-900/50">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-100">Email Alerts</span>
                </div>
                <span className="text-gray-100">
                  {alerts.filter((a) => a.type === 'Email').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-950/30 rounded-lg border border-orange-900/50">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-100">Broadcasts</span>
                </div>
                <span className="text-gray-100">
                  {alerts.filter((a) => a.type === 'Broadcast').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-950/30 rounded-lg border border-green-900/50">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-gray-100">Total Sent</span>
                </div>
                <span className="text-gray-100">{alerts.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert History */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">Alert History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const Icon = getAlertTypeIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className={`p-2 rounded-lg ${getAlertTypeColor(alert.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-100">{alert.title}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getAlertTypeColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>To: {alert.recipients}</span>
                        <span>From: {alert.sender}</span>
                      </div>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
