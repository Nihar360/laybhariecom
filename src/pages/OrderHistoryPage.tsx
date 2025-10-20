import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Package, Loader2, Calendar, MapPin, CreditCard, ChevronRight, X } from 'lucide-react';
import { ordersService } from '../api/orders';
import { toast } from 'sonner';
import type { Order } from '../types/api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersService.getOrders();
        if (response.success && response.data) {
          setOrders(response.data);
        } else {
          toast.error('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track all your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate('/')} className="bg-black hover:bg-gray-800">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        Order #{order.orderNumber}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-gray-600">
                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <ImageWithFallback
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <span className="text-sm font-medium text-gray-600">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      className="flex-1 bg-black hover:bg-gray-800"
                      onClick={() => navigate(`/order-success/${order.orderNumber}`)}
                    >
                      View Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white rounded-xl shadow-2xl z-50 flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1 }} className="p-6">
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedOrder.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold text-gray-900">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <ImageWithFallback
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
                            {(item.size || item.color) && (
                              <p className="text-sm text-gray-500">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ' • '}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-gray-700">{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p className="text-gray-700">{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-gray-700">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-700">{selectedOrder.shippingAddress.country}</p>
                      <div className="pt-2 mt-2 border-t border-gray-200 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.mobile}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {selectedOrder.shippingAddress.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Cost Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping Charges</span>
                        <span>
                          {selectedOrder.shipping === 0 ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            `$${selectedOrder.shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total Amount</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      navigate(`/order-success/${selectedOrder.orderNumber}`);
                    }}
                    className="flex-1 bg-black hover:bg-gray-800"
                  >
                    View Receipt
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
