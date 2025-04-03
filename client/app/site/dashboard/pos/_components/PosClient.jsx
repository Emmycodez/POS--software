"use client";

import { createTransaction, getPosProducts } from "@/actions/serverActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Minus,
  Plus,
  Scan,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function POSSystem({data}) {
  const [products, setProducts] = useState(data?.data);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentProcessingStep, setPaymentProcessingStep] = useState("initial");
  const [amountReceived, setAmountReceived] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [transactionData, setTransactionData] = useState({});
  const [isQuantityLow, setIsQuantityLow] = useState(false);

  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const result = await getPosProducts(); // Wait for the response
  //       // console.log("These are the products: ", result.data);
  //       setProducts(result.data); // Store products in state
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   }
  //   fetchProducts();
  // }, []);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.quantity) {
          setIsQuantityLow(true);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Update item quantity in cart
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Process checkout
  const processCheckout = () => {
    

    const outOfStockItems = cart.filter((cartItem) => {
      // Find the corresponding product in the products state
      const productInStock = products.find((p) => p.id === cartItem.id);
      
      // Check if the cart quantity exceeds the available stock
      return productInStock && cartItem.quantity > productInStock.quantity;
    });
  

    if (outOfStockItems.length > 0) {
      // Show an alert or notification
      alert(
        `Not enough stock for: ${outOfStockItems
          .map((item) => item.product.name)
          .join(", ")}`
      );
      return; // Prevent checkout
    }
    if (checkoutStep === "cart") {
      setCheckoutStep("payment");
    } else {
      // Reset payment processing state
      setPaymentProcessingStep("initial");
      setAmountReceived(0);
      setPaymentDialogOpen(true);
    }
  };

  const createTransactionData = async () => {
    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const data = {
      // cashier: loggedincashierid
      products: cart.map((item) => ({
        product: item.id, // Ensure this is the ObjectId
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalAmount,
      paymentMethod,
      amountReceived,
      changeGiven: paymentMethod === "cash" ? amountReceived - totalAmount : 0,
    };
    console.log("The create transaction command is being run", data);

    await createTransaction(data);
  };

  const completePayment = () => {
    // Here you would typically process the payment and update stock
    setPaymentProcessingStep("completed");
    createTransactionData();

    // After a delay, reset the cart and close the dialog
    setTimeout(() => {
      setCart([]);
      setCheckoutStep("cart");
      setPaymentDialogOpen(false);
      setPaymentProcessingStep("initial");
    }, 2000);
  };

  // Calculate change for cash payments
  const calculateChange = () => {
    const received = Number.parseFloat(amountReceived) || 0;
    const total = cartTotal;
    return received - total; // Allow negative values to indicate insufficient payment
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tigth">POS System</h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative md:hidden"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <CartPanel
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    cartTotal={cartTotal}
                    checkoutStep={checkoutStep}
                    setCheckoutStep={setCheckoutStep}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    processCheckout={processCheckout}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Product Selection */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Scan className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="All" className="mb-4">
            <TabsList className="mb-4 overflow-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-center">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-20 w-20 object-cover rounded-md"
                      width={80}
                      height={80}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex justify-between items-center gap-x-2 mt-2">
                    <p className="text-lg font-bold">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(product.price)}
                    </p>
                    <Badge
                      className="text-nowrap px-3 py-1"
                      variant={
                        product.quantity > 10 ? "outline" : "destructive"
                      }
                    >
                      {product.quantity} left
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => addToCart(product)}
                    disabled={product.quantity <= 0}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart (Hidden on mobile) */}
        <div className="hidden md:block w-96 border-l bg-muted/10 p-4 overflow-auto">
          <CartPanel
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            cartTotal={cartTotal}
            checkoutStep={checkoutStep}
            setCheckoutStep={setCheckoutStep}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            processCheckout={processCheckout}
          />
        </div>
      </div>

      {isQuantityLow && (
        <Dialog>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Product is Out of Stock!!!</DialogTitle>
              <DialogDescription>
                Please restock product and update stock quantity in the
                inventory page
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {/* Payment Processing Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentProcessingStep === "completed"
                ? "Payment Successful"
                : `${
                    paymentMethod.charAt(0).toUpperCase() +
                    paymentMethod.slice(1)
                  } Payment`}
            </DialogTitle>
          </DialogHeader>

          {paymentProcessingStep === "initial" && (
            <div className="py-6">
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>
                        Insert customer's card into the Moniepoint POS machine
                      </li>
                      <li>Enter the amount: ₦{cartTotal.toFixed(2)}</li>
                      <li>Let the customer enter their PIN</li>
                      <li>Wait for transaction approval</li>
                      <li>Click "Mark as Paid" below once approved</li>
                    </ol>
                  </div>
                  <Button className="w-full" onClick={() => completePayment()}>
                    Mark as Paid
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setPaymentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <div className="flex justify-between mb-2">
                      <span>Total Amount:</span>
                      <span className="font-bold">₦{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount-received">Amount Received</Label>
                      <Input
                        id="amount-received"
                        type="number"
                        min={cartTotal.toFixed(2)}
                        step="0.01"
                        value={amountReceived}
                        onChange={(e) =>
                          setAmountReceived(Number(e.target.value) || 0)
                        }
                        placeholder="Enter amount"
                      />
                      {/* (e) => setAmountReceived(e.target.value) */}
                    </div>
                    {Number.parseFloat(amountReceived) > 0 && (
                      <div className="flex justify-between mt-4 font-medium">
                        <span>Change:</span>
                        <span
                          className={
                            calculateChange() >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          ₦{calculateChange().toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => completePayment()}
                    disabled={Number.parseFloat(amountReceived) < cartTotal}
                  >
                    Confirm Payment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setPaymentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">Bank Details:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Bank Name:
                        </span>
                        <span className="font-medium">First Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Account Number:
                        </span>
                        <span className="font-medium">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Account Name:
                        </span>
                        <span className="font-medium">Acme Coffee Shop</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">
                          ₦{cartTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                      Please verify the transfer has been received before
                      confirming payment.
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => completePayment()}>
                    Payment Received
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setPaymentDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {paymentProcessingStep === "completed" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p>Payment successful! Thank you.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Transaction ID: TXN-{Date.now().toString().slice(-6)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Cart Panel Component
function CartPanel({
  cart,
  updateQuantity,
  removeFromCart,
  cartTotal,
  checkoutStep,
  setCheckoutStep,
  paymentMethod,
  setPaymentMethod,
  processCheckout,
}) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4">
        {checkoutStep === "cart" ? "Shopping Cart" : "Payment"}
      </h2>

      {checkoutStep === "cart" ? (
        <>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 border-b"
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-md"
                    width={80}
                    height={80}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(item.price)}
                      each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Order Summary</h3>
            <div className="bg-background rounded-lg p-3">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(cartTotal)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(cartTotal)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 bg-background rounded-lg p-3">
                <RadioGroupItem value="card" id="card" />
                <Label
                  htmlFor="card"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-background rounded-lg p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label
                  htmlFor="cash"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Banknote className="h-4 w-4" />
                  Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-background rounded-lg p-3">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label
                  htmlFor="transfer"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {checkoutStep === "payment" && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCheckoutStep("cart")}
          >
            Back to Cart
          </Button>
        )}
        <Button
          className="w-full"
          disabled={cart.length === 0}
          onClick={processCheckout}
        >
          {checkoutStep === "cart" ? "Proceed to Checkout" : "Complete Payment"}
        </Button>
      </div>
    </div>
  );
}
