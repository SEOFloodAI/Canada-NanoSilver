import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  Tag,
  Truck,
  CreditCard,
  Lock,
  Check,
  X,
  Bitcoin,
  Wallet,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ProductDisclaimer } from '@/components/ui-custom/Disclaimer';

// Payment method components
function StripePayment({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Card Number</label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="pl-10 input-holographic"
            maxLength={19}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Expiry</label>
          <Input
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="input-holographic"
            maxLength={5}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">CVC</label>
          <Input
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="input-holographic"
            maxLength={4}
            type="password"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full btn-holographic"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>
    </form>
  );
}

function PayPalPayment({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPal = async () => {
    setIsProcessing(true);
    // Simulate PayPal redirect and processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-4">
          You will be redirected to PayPal to complete your payment
        </p>
        <Button
          onClick={handlePayPal}
          className="w-full bg-[#0070BA] hover:bg-[#003087] text-white"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Pay {formatCurrency(amount)} with PayPal
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function CryptoPayment({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [selectedCrypto, setSelectedCrypto] = useState<'btc' | 'eth' | 'usdt'>('btc');
  const [isProcessing, setIsProcessing] = useState(false);

  const cryptoRates: Record<string, number> = {
    btc: amount / 65000,
    eth: amount / 3500,
    usdt: amount,
  };

  const cryptoAddresses: Record<string, string> = {
    btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    eth: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    usdt: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate blockchain confirmation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['btc', 'eth', 'usdt'] as const).map((crypto) => (
          <button
            key={crypto}
            onClick={() => setSelectedCrypto(crypto)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors',
              selectedCrypto === crypto
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50'
            )}
          >
            {crypto.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">Send exactly:</p>
        <p className="text-2xl font-bold text-primary">
          {cryptoRates[selectedCrypto].toFixed(6)} {selectedCrypto.toUpperCase()}
        </p>
        <p className="text-sm text-muted-foreground">
          = {formatCurrency(amount)} CAD
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">To Address:</p>
        <div className="flex gap-2">
          <Input
            value={cryptoAddresses[selectedCrypto]}
            readOnly
            className="input-holographic font-mono text-sm"
          />
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(cryptoAddresses[selectedCrypto])}
            className="border-primary/30"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-lg">
        <p className="text-sm text-amber-400">
          <strong>Note:</strong> Payment confirmation may take 10-30 minutes depending on network congestion.
        </p>
      </div>

      <Button
        onClick={handleConfirm}
        className="w-full btn-holographic"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Waiting for confirmation...
          </>
        ) : (
          <>
            <Bitcoin className="w-4 h-4 mr-2" />
            I've Sent the Payment
          </>
        )}
      </Button>
    </div>
  );
}

function GooglePayPayment({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGooglePay = async () => {
    setIsProcessing(true);
    // Simulate Google Pay processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Pay securely with Google Pay
        </p>
        <Button
          onClick={handleGooglePay}
          className="w-full bg-black hover:bg-gray-800 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Pay {formatCurrency(amount)} with Google Pay
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'crypto' | 'google_pay'>('stripe');
  const [orderComplete, setOrderComplete] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setIsCheckingOut(true);
  };

  const handlePaymentSuccess = () => {
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-lg mx-auto px-4">
          <Card className="holographic-card text-center py-12">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="font-orbitron text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. You will receive a confirmation email shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/products')} className="btn-holographic">
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="border-primary/30">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-lg mx-auto px-4">
          <Card className="holographic-card text-center py-12">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="font-orbitron text-xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Browse our products and add items to your cart
              </p>
              <Button onClick={() => navigate('/products')} className="btn-holographic">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-orbitron text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="font-orbitron">Cart Items ({cart.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-orbitron font-semibold">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.product.sku}</p>
                        </div>
                        <p className="font-semibold text-primary">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <ProductDisclaimer />
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="font-orbitron">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                {!cart.couponCode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="pl-9 input-holographic"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      className="border-primary/30"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Coupon: {cart.couponCode}</span>
                    </div>
                    <button onClick={removeCoupon}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatCurrency(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (13%)</span>
                    <span>{formatCurrency(cart.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span>{cart.shipping === 0 ? 'Free' : formatCurrency(cart.shipping)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-orbitron font-semibold">Total</span>
                  <span className="font-orbitron text-2xl font-bold text-primary">
                    {formatCurrency(cart.total)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full btn-holographic"
                  size="lg"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Free shipping on orders over $100
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Modal */}
        <Dialog open={isCheckingOut} onOpenChange={setIsCheckingOut}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-orbitron">Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Choose your preferred payment method
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {/* Order Total */}
              <div className="p-4 bg-muted rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order Total</span>
                  <span className="font-orbitron text-xl font-bold text-primary">
                    {formatCurrency(cart.total)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <Tabs value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="stripe" className="text-xs">Card</TabsTrigger>
                  <TabsTrigger value="paypal" className="text-xs">PayPal</TabsTrigger>
                  <TabsTrigger value="crypto" className="text-xs">Crypto</TabsTrigger>
                  <TabsTrigger value="google_pay" className="text-xs">GPay</TabsTrigger>
                </TabsList>

                <TabsContent value="stripe">
                  <StripePayment amount={cart.total} onSuccess={handlePaymentSuccess} />
                </TabsContent>

                <TabsContent value="paypal">
                  <PayPalPayment amount={cart.total} onSuccess={handlePaymentSuccess} />
                </TabsContent>

                <TabsContent value="crypto">
                  <CryptoPayment amount={cart.total} onSuccess={handlePaymentSuccess} />
                </TabsContent>

                <TabsContent value="google_pay">
                  <GooglePayPayment amount={cart.total} onSuccess={handlePaymentSuccess} />
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
