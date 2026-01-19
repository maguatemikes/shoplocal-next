"use client"

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Store, Truck, Package } from "lucide-react";
import { useState } from "react";

type DeliveryMethod = 'pickup' | 'delivery' | 'shipping';

interface AddToCartModalProps {
  show: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
}

export default function AddToCartModal({
  show,
  onClose,
  productName,
  productImage,
}: AddToCartModalProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('shipping');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="text-green-500 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Added to Cart!
              </h2>
            </div>

            {productImage && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <img src={productImage || 'https://via.placeholder.com/600'} alt={productName} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm sm:text-base text-gray-900 font-medium text-left">
                  {productName}
                </p>
              </div>
            )}

            {!productImage && (
              <p className="text-gray-600 mb-6 text-center">{productName}</p>
            )}

            {/* Delivery Method Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Choose delivery method:</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Pickup */}
                <button
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1.5 ${
                    deliveryMethod === 'pickup' ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    <Store className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      deliveryMethod === 'pickup' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${
                    deliveryMethod === 'pickup' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Pickup
                  </span>
                  <span className={`text-[10px] sm:text-xs mt-0.5 ${
                    deliveryMethod === 'pickup' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    2 hours
                  </span>
                </button>

                {/* Delivery */}
                <button
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1.5 ${
                    deliveryMethod === 'delivery' ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    <Truck className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      deliveryMethod === 'delivery' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${
                    deliveryMethod === 'delivery' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Delivery
                  </span>
                  <span className={`text-[10px] sm:text-xs mt-0.5 ${
                    deliveryMethod === 'delivery' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    15-40 min
                  </span>
                </button>

                {/* Shipping */}
                <button
                  onClick={() => setDeliveryMethod('shipping')}
                  className={`flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'shipping'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1.5 ${
                    deliveryMethod === 'shipping' ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    <Package className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      deliveryMethod === 'shipping' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${
                    deliveryMethod === 'shipping' ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    Shipping
                  </span>
                  <span className={`text-[10px] sm:text-xs mt-0.5 ${
                    deliveryMethod === 'shipping' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    3-5 days
                  </span>
                </button>
              </div>
            </div>

            <button
              className="w-full py-3 bg-[#F57C00] hover:bg-[#E67000] text-white rounded-xl transition-colors font-medium"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}