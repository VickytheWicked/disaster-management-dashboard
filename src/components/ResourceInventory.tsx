import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { mockResources } from '../data/mockData';
import { Resource } from '../types';
import { toast } from 'sonner@2.0.3';

export function ResourceInventory() {
  const [resources, setResources] = useState(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === 'all' || resource.location === filterLocation;
    const matchesCondition = filterCondition === 'all' || resource.condition === filterCondition;
    return matchesSearch && matchesLocation && matchesCondition;
  });

  const locations = Array.from(new Set(mockResources.map((r) => r.location)));

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
    toast.success('Resource deleted successfully');
  };

  const ResourceForm = ({ resource, onSave }: { resource?: Resource; onSave: (data: Partial<Resource>) => void }) => {
    const [formData, setFormData] = useState<Partial<Resource>>(
      resource || {
        name: '',
        quantity: 0,
        unit: '',
        condition: 'New',
        location: '',
        category: '',
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="e.g., bottles, kits, units"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => setFormData({ ...formData, condition: value as any })}
            >
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate || ''}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {resource ? 'Update' : 'Add'} Resource
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
          <h1 className="text-gray-100 mb-2">Resource Inventory</h1>
          <p className="text-gray-400">Manage and track all disaster relief resources</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>
                Enter the details of the new resource item
              </DialogDescription>
            </DialogHeader>
            <ResourceForm
              onSave={(data) => {
                const newResource: Resource = {
                  id: `R${String(resources.length + 1).padStart(3, '0')}`,
                  name: data.name!,
                  quantity: data.quantity!,
                  unit: data.unit!,
                  condition: data.condition as any,
                  location: data.location!,
                  category: data.category!,
                  expiryDate: data.expiryDate,
                  lastUpdated: new Date().toISOString().split('T')[0],
                };
                setResources([...resources, newResource]);
                setIsAddDialogOpen(false);
                toast.success('Resource added successfully');
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-900">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-100">
            Resources ({filteredResources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.id}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedResource(resource);
                          setIsDetailDialogOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {resource.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      {resource.quantity} {resource.unit}
                    </TableCell>
                    <TableCell>
                      <Badge className={getConditionColor(resource.condition)}>
                        {resource.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>{resource.location}</TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>{resource.expiryDate || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedResource(resource);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(resource.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No resources found</p>
                <p className="text-gray-500">Try adjusting your filters or add a new resource</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update the resource details</DialogDescription>
          </DialogHeader>
          {selectedResource && (
            <ResourceForm
              resource={selectedResource}
              onSave={(data) => {
                setResources(
                  resources.map((r) =>
                    r.id === selectedResource.id ? { ...r, ...data } : r
                  )
                );
                setIsEditDialogOpen(false);
                toast.success('Resource updated successfully');
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resource Details</DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Resource ID</p>
                <p className="text-gray-100">{selectedResource.id}</p>
              </div>
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-gray-100">{selectedResource.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Quantity</p>
                  <p className="text-gray-100">
                    {selectedResource.quantity} {selectedResource.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Condition</p>
                  <Badge className={getConditionColor(selectedResource.condition)}>
                    {selectedResource.condition}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Category</p>
                <p className="text-gray-100">{selectedResource.category}</p>
              </div>
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-gray-100">{selectedResource.location}</p>
              </div>
              {selectedResource.expiryDate && (
                <div>
                  <p className="text-gray-400">Expiry Date</p>
                  <p className="text-gray-100">{selectedResource.expiryDate}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400">Last Updated</p>
                <p className="text-gray-100">{selectedResource.lastUpdated}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
