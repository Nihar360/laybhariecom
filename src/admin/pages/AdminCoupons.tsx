import { useEffect, useState } from 'react';
import { adminCouponsService, CouponResponse, CreateCouponRequest, UpdateCouponRequest } from '../api/adminCoupons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponResponse | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const couponType = watch('type');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminCouponsService.getAllCoupons();
      setCoupons(response.data);
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    reset();
    setValue('type', 'PERCENTAGE');
    setCreateDialogOpen(true);
  };

  const handleCreateCoupon = async (data: any) => {
    try {
      const couponData: CreateCouponRequest = {
        code: data.code.toUpperCase(),
        type: data.type,
        value: parseFloat(data.value),
        minOrderAmount: data.minOrderAmount ? parseFloat(data.minOrderAmount) : undefined,
        maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : undefined,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : undefined,
        validFrom: data.validFrom,
        validTo: data.validTo,
      };
      await adminCouponsService.createCoupon(couponData);
      toast.success('Coupon created successfully');
      setCreateDialogOpen(false);
      reset();
      fetchCoupons();
    } catch (error: any) {
      console.error('Error creating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleEdit = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setValue('code', coupon.code);
    setValue('type', coupon.type);
    setValue('value', coupon.value);
    setValue('minOrderAmount', coupon.minOrderAmount || '');
    setValue('maxDiscountAmount', coupon.maxDiscountAmount || '');
    setValue('usageLimit', coupon.usageLimit || '');
    setValue('validFrom', coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '');
    setValue('validTo', coupon.validTo ? new Date(coupon.validTo).toISOString().split('T')[0] : '');
    setEditDialogOpen(true);
  };

  const handleUpdateCoupon = async (data: any) => {
    if (!selectedCoupon) return;

    try {
      const updateData: UpdateCouponRequest = {
        code: data.code.toUpperCase(),
        type: data.type,
        value: parseFloat(data.value),
        minOrderAmount: data.minOrderAmount ? parseFloat(data.minOrderAmount) : undefined,
        maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : undefined,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : undefined,
        validFrom: data.validFrom,
        validTo: data.validTo,
      };
      await adminCouponsService.updateCoupon(selectedCoupon.id, updateData);
      toast.success('Coupon updated successfully');
      setEditDialogOpen(false);
      reset();
      fetchCoupons();
    } catch (error: any) {
      console.error('Error updating coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    }
  };

  const handleToggleActive = async (coupon: CouponResponse) => {
    try {
      if (coupon.status === 'ACTIVE') {
        await adminCouponsService.deactivateCoupon(coupon.id);
        toast.success('Coupon deactivated successfully');
      } else {
        await adminCouponsService.activateCoupon(coupon.id);
        toast.success('Coupon activated successfully');
      }
      fetchCoupons();
    } catch (error: any) {
      console.error('Error toggling coupon status:', error);
      toast.error(error.response?.data?.message || 'Failed to update coupon status');
    }
  };

  const handleDelete = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCoupon) return;

    try {
      await adminCouponsService.deleteCoupon(selectedCoupon.id);
      toast.success('Coupon deleted successfully');
      setDeleteDialogOpen(false);
      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'INACTIVE':
        return 'secondary';
      case 'EXPIRED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading && coupons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupon Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage discount coupons for your store
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>
            View and manage all discount coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid From</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{coupon.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                    </TableCell>
                    <TableCell>
                      {coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {coupon.usageCount} / {coupon.usageLimit || '∞'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(coupon.status)}>
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(coupon.validFrom)}</TableCell>
                    <TableCell>{formatDate(coupon.validTo)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(coupon)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(coupon)}
                        >
                          {coupon.status === 'ACTIVE' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(coupon)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No coupons found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
            <DialogDescription>Create a new discount coupon for your store</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreateCoupon)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input 
                  id="code" 
                  {...register('code', { required: true })} 
                  placeholder="SUMMER2025"
                  className="uppercase"
                />
                {errors.code && <p className="text-sm text-red-500">Code is required</p>}
              </div>
              <div>
                <Label htmlFor="type">Discount Type *</Label>
                <Select onValueChange={(value: string) => setValue('type', value)} defaultValue="PERCENTAGE">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Discount Value *</Label>
                <Input 
                  id="value" 
                  type="number" 
                  step="0.01" 
                  {...register('value', { required: true })} 
                  placeholder={couponType === 'PERCENTAGE' ? '10 (for 10%)' : '100 (for ₹100)'}
                />
                {errors.value && <p className="text-sm text-red-500">Value is required</p>}
              </div>
              <div>
                <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
                <Input id="minOrderAmount" type="number" step="0.01" {...register('minOrderAmount')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxDiscountAmount">Max Discount Amount (₹)</Label>
                <Input id="maxDiscountAmount" type="number" step="0.01" {...register('maxDiscountAmount')} />
              </div>
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input id="usageLimit" type="number" {...register('usageLimit')} placeholder="Leave empty for unlimited" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input id="validFrom" type="date" {...register('validFrom', { required: true })} />
                {errors.validFrom && <p className="text-sm text-red-500">Valid from date is required</p>}
              </div>
              <div>
                <Label htmlFor="validTo">Valid Until *</Label>
                <Input id="validTo" type="date" {...register('validTo', { required: true })} />
                {errors.validTo && <p className="text-sm text-red-500">Valid until date is required</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Coupon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleUpdateCoupon)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-code">Coupon Code *</Label>
                <Input 
                  id="edit-code" 
                  {...register('code', { required: true })} 
                  className="uppercase"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Discount Type *</Label>
                <Select onValueChange={(value: string) => setValue('type', value)} defaultValue={selectedCoupon?.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-value">Discount Value *</Label>
                <Input id="edit-value" type="number" step="0.01" {...register('value', { required: true })} />
              </div>
              <div>
                <Label htmlFor="edit-minOrderAmount">Minimum Order Amount (₹)</Label>
                <Input id="edit-minOrderAmount" type="number" step="0.01" {...register('minOrderAmount')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-maxDiscountAmount">Max Discount Amount (₹)</Label>
                <Input id="edit-maxDiscountAmount" type="number" step="0.01" {...register('maxDiscountAmount')} />
              </div>
              <div>
                <Label htmlFor="edit-usageLimit">Usage Limit</Label>
                <Input id="edit-usageLimit" type="number" {...register('usageLimit')} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-validFrom">Valid From *</Label>
                <Input id="edit-validFrom" type="date" {...register('validFrom', { required: true })} />
              </div>
              <div>
                <Label htmlFor="edit-validTo">Valid Until *</Label>
                <Input id="edit-validTo" type="date" {...register('validTo', { required: true })} />
              </div>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete coupon "{selectedCoupon?.code}"? This action cannot be undone.
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
