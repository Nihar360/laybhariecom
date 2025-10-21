import { useEffect, useState } from 'react';
import { adminProductsService, ProductResponse, CreateProductRequest, UpdateProductRequest } from '../api/adminProducts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminProductsService.getAllProducts(currentPage, 20);
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    reset();
    setCreateDialogOpen(true);
  };

  const handleCreateProduct = async (data: any) => {
    try {
      const productData: CreateProductRequest = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        category: data.category,
        image: data.image,
        stockCount: parseInt(data.stockCount),
      };
      await adminProductsService.createProduct(productData);
      toast.success('Product created successfully');
      setCreateDialogOpen(false);
      reset();
      fetchProducts();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleEdit = (product: ProductResponse) => {
    setSelectedProduct(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('originalPrice', product.originalPrice || '');
    setValue('category', product.category);
    setValue('image', product.image);
    setEditDialogOpen(true);
  };

  const handleUpdateProduct = async (data: any) => {
    if (!selectedProduct) return;

    try {
      const updateData: UpdateProductRequest = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        category: data.category,
        image: data.image,
      };
      await adminProductsService.updateProduct(selectedProduct.id, updateData);
      toast.success('Product updated successfully');
      setEditDialogOpen(false);
      reset();
      fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleStockAdjustment = (product: ProductResponse) => {
    setSelectedProduct(product);
    setStockDialogOpen(true);
  };

  const handleAdjustStock = async (data: any) => {
    if (!selectedProduct) return;

    try {
      await adminProductsService.adjustStock(selectedProduct.id, {
        quantity: parseInt(data.quantity),
        reason: data.reason,
      });
      toast.success('Stock adjusted successfully');
      setStockDialogOpen(false);
      reset();
      fetchProducts();
    } catch (error: any) {
      console.error('Error adjusting stock:', error);
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    }
  };

  const handleDelete = (product: ProductResponse) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await adminProductsService.deleteProduct(selectedProduct.id);
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            View and manage all products in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div>
                        <div>{formatCurrency(product.price)}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.stockCount}</TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge variant="default">In Stock</Badge>
                      ) : (
                        <Badge variant="secondary">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStockAdjustment(product)}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * 20 + 1} to {Math.min((currentPage + 1) * 20, totalElements)} of {totalElements} products
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>Add a new product to your catalog</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" {...register('name', { required: true })} />
                {errors.name && <p className="text-sm text-red-500">Name is required</p>}
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input id="category" {...register('category', { required: true })} />
                {errors.category && <p className="text-sm text-red-500">Category is required</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" {...register('description', { required: true })} />
              {errors.description && <p className="text-sm text-red-500">Description is required</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" step="0.01" {...register('price', { required: true })} />
                {errors.price && <p className="text-sm text-red-500">Price is required</p>}
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input id="originalPrice" type="number" step="0.01" {...register('originalPrice')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockCount">Stock Count *</Label>
                <Input id="stockCount" type="number" {...register('stockCount', { required: true })} />
                {errors.stockCount && <p className="text-sm text-red-500">Stock count is required</p>}
              </div>
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input id="image" {...register('image', { required: true })} />
                {errors.image && <p className="text-sm text-red-500">Image URL is required</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input id="edit-name" {...register('name', { required: true })} />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Input id="edit-category" {...register('category', { required: true })} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea id="edit-description" {...register('description', { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input id="edit-price" type="number" step="0.01" {...register('price', { required: true })} />
              </div>
              <div>
                <Label htmlFor="edit-originalPrice">Original Price (₹)</Label>
                <Input id="edit-originalPrice" type="number" step="0.01" {...register('originalPrice')} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-image">Image URL *</Label>
              <Input id="edit-image" {...register('image', { required: true })} />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Update inventory for {selectedProduct?.name}
              <br />
              Current Stock: <strong>{selectedProduct?.stockCount}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAdjustStock)} className="space-y-4">
            <div>
              <Label htmlFor="quantity">Quantity Adjustment</Label>
              <Input 
                id="quantity" 
                type="number" 
                {...register('quantity', { required: true })} 
                placeholder="Enter positive to add, negative to remove"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use positive numbers to add stock, negative to remove
              </p>
            </div>
            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Textarea id="reason" {...register('reason', { required: true })} placeholder="E.g., Received new shipment, Damaged goods, etc." />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setStockDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Adjust Stock</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
