import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

interface RazorpayModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export function RazorpayModal({ open, onClose, onSuccess, amount }: RazorpayModalProps) {
  const handlePayment = () => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Razorpay Secure Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Display */}
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
            
            <button className="w-full flex items-center gap-3 p-4 border rounded-lg hover:border-black transition-all">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <p className="font-medium">UPI</p>
                <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 border rounded-lg hover:border-black transition-all">
              <CreditCard className="w-6 h-6" />
              <div className="text-left">
                <p className="font-medium">Card</p>
                <p className="text-xs text-gray-500">Credit or Debit Card</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-4 border rounded-lg hover:border-black transition-all">
              <Wallet className="w-6 h-6" />
              <div className="text-left">
                <p className="font-medium">Wallet</p>
                <p className="text-xs text-gray-500">Amazon Pay, Paytm Wallet</p>
              </div>
            </button>
          </div>

          {/* Pay Button */}
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handlePayment}
          >
            Pay ${amount.toFixed(2)}
          </Button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured by Razorpay</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
