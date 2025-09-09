import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plant } from '@shared/api';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  Filter,
  SortAsc
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminProducts() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const [newPlant, setNewPlant] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [''],
    stockQuantity: '',
    careLevel: 'Easy',
    petFriendly: false,
    lightRequirement: 'Bright indirect light',
    wateringFrequency: 'Weekly',
    potSize: '4 inch'
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('/api/plants');
      if (response.ok) {
        const data = await response.json();
        setPlants(data.plants);
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlant = async () => {
    try {
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlant)
      });

      if (response.ok) {
        const data = await response.json();
        setPlants(prev => [data.plant, ...prev]);

        // Reset state immediately for better responsiveness
        setIsAddDialogOpen(false);
        setEditingPlant(null);
        resetForm();

        // Show success message
        alert('✅ Plant added successfully!');
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to add plant: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      alert('❌ Network error. Please check your connection and try again.');
    }
  };

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setNewPlant({
      name: plant.name,
      description: plant.description,
      price: plant.price.toString(),
      originalPrice: plant.originalPrice?.toString() || '',
      category: plant.category,
      images: plant.images,
      stockQuantity: plant.stockQuantity.toString(),
      careLevel: plant.careLevel,
      petFriendly: plant.petFriendly,
      lightRequirement: plant.sunlight || 'Medium',
      wateringFrequency: plant.watering || 'Medium',
      potSize: '4 inch' // Default value since this field doesn't exist in Plant interface
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdatePlant = async () => {
    if (!editingPlant) return;

    try {
      const response = await fetch(`/api/plants/${editingPlant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlant)
      });

      if (response.ok) {
        const data = await response.json();
        setPlants(prev => prev.map(p =>
          p.id === editingPlant.id ? data.plant : p
        ));

        // Reset state immediately for better responsiveness
        setIsAddDialogOpen(false);
        setEditingPlant(null);
        resetForm();

        // Show success message
        alert('✅ Plant updated successfully! Ready for next edit.');
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to update plant: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating plant:', error);
      alert('❌ Network error. Please check your connection and try again.');
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    if (confirm('Are you sure you want to delete this plant?')) {
      try {
        const response = await fetch(`/api/plants/${plantId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setPlants(prev => prev.filter(p => p.id !== plantId));
          alert('Plant deleted successfully!');
        } else {
          const errorData = await response.json();
          alert(`Failed to delete plant: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting plant:', error);
        alert('Failed to delete plant. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setNewPlant({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      images: [''],
      stockQuantity: '',
      careLevel: 'Easy',
      petFriendly: false,
      lightRequirement: 'Bright indirect light',
      wateringFrequency: 'Weekly',
      potSize: '4 inch'
    });
    setEditingPlant(null);
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'indoor', label: 'Indoor Plants' },
    { value: 'outdoor', label: 'Outdoor Plants' },
    { value: 'rare', label: 'Rare Plants' },
    { value: 'flowering', label: 'Flowering Plants' },
    { value: 'bonsai', label: 'Bonsai' },
    { value: 'succulents', label: 'Succulents' },
    { value: 'herbs', label: 'Herbs' }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your plant inventory</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlant ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newPlant.name}
                      onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
                      placeholder="Plant name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newPlant.category} onValueChange={(value) => setNewPlant({...newPlant, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPlant.description}
                    onChange={(e) => setNewPlant({...newPlant, description: e.target.value})}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newPlant.price}
                      onChange={(e) => setNewPlant({...newPlant, price: e.target.value})}
                      placeholder="299"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={newPlant.originalPrice}
                      onChange={(e) => setNewPlant({...newPlant, originalPrice: e.target.value})}
                      placeholder="399"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newPlant.stockQuantity}
                      onChange={(e) => setNewPlant({...newPlant, stockQuantity: e.target.value})}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newPlant.images[0]}
                    onChange={(e) => setNewPlant({...newPlant, images: [e.target.value]})}
                    placeholder="https://example.com/plant-image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="careLevel">Care Level</Label>
                    <Select value={newPlant.careLevel} onValueChange={(value) => setNewPlant({...newPlant, careLevel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="potSize">Pot Size</Label>
                    <Input
                      id="potSize"
                      value={newPlant.potSize}
                      onChange={(e) => setNewPlant({...newPlant, potSize: e.target.value})}
                      placeholder="4 inch"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={editingPlant ? handleUpdatePlant : handleAddPlant}>
                    {editingPlant ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Product Inventory</span>
              <Badge variant="secondary">{plants.length} products</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlants.map((plant) => (
                    <TableRow key={plant.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={plant.images[0]} 
                              alt={plant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{plant.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {plant.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{plant.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-semibold">₹{plant.price.toLocaleString()}</span>
                          {plant.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{plant.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plant.stockQuantity > 10 ? "secondary" : plant.stockQuantity > 0 ? "default" : "destructive"}>
                          {plant.stockQuantity} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={plant.stockQuantity > 0 ? "secondary" : "destructive"}>
                          {plant.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPlant(plant)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeletePlant(plant.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPlants.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
