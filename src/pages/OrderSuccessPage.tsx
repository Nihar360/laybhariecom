import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, Package, Truck, X, MapPin, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ordersService } from '../api/orders';
import { toast } from 'sonner';
import type { Order } from '../types/api';

export function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        toast.error('Order number not found');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const response = await ordersService.getOrderByNumber(orderNumber);
        if (response.success && response.data) {
          setOrderData(response.data);
        } else {
          toast.error('Order not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, navigate]);

  const handleViewOrderDetails = () => {
    if (orderData) {
      setShowModal(true);
    }
  };

  const getEstimatedDelivery = () => {
    const orderDate = orderData?.orderDate ? new Date(orderData.orderDate) : new Date();
    const minDays = 3;
    const maxDays = 5;

    const minDate = new Date(orderDate);
    minDate.setDate(minDate.getDate() + minDays);

    const maxDate = new Date(orderDate);
    maxDate.setDate(maxDate.getDate() + maxDays);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    };

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <div className="absolute inset-0 animate-ping opacity-25">
              <CheckCircle className="w-24 h-24 text-green-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-gray-600">We've received your order</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Shipping Soon</p>
                <p className="text-sm text-gray-600">Expected delivery in 3-5 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-black hover:bg-gray-800"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          {orderData ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleViewOrderDetails}
            >
              View Order Details
            </Button>
          ) : (
            <p className="text-sm text-gray-500 text-center pt-2">
              Order details are available immediately after checkout
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && orderData && (
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
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1 }} className="p-6">
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Estimated Delivery</p>
                      <p className="text-blue-700 font-medium">{getEstimatedDelivery()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div
                          key={`${item.id}-${item.size}-${item.color}-${index}`}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
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
                      <p className="font-medium text-gray-900">{orderData.shippingAddress.fullName}</p>
                      <p className="text-gray-700">{orderData.shippingAddress.addressLine1}</p>
                      {orderData.shippingAddress.addressLine2 && (
                        <p className="text-gray-700">{orderData.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-gray-700">
                        {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-700">{orderData.shippingAddress.country}</p>
                      <div className="pt-2 mt-2 border-t border-gray-200 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {orderData.shippingAddress.mobile}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {orderData.shippingAddress.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Cost Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>${orderData.subtotal.toFixed(2)}</span>
                      </div>
                      {orderData.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${orderData.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping Charges</span>
                        <span>
                          {orderData.shipping === 0 ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            `$${orderData.shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total Amount</span>
                        <span>${orderData.total.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Payment Method:</span>{' '}
                          {orderData.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Order Number:</span>{' '}
                          {orderData.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Order Date:</span>{' '}
                          {new Date(orderData.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
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
                      navigate('/');
                    }}
                    className="flex-1 bg-black hover:bg-gray-800"
                  >
                    Continue Shopping
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