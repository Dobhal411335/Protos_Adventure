"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Share2, Ruler, Mail, Star, MapPin, InfoIcon, X, Loader2 } from "lucide-react"
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import VisuallyHidden from '@/components/VisuallyHidden';
import Autoplay from "embla-carousel-autoplay";
export default function ProductDetailView({ product }) {
  // console.log(product);
  // --- Ask An Expert Modal State ---
  const [showExpertModal, setShowExpertModal] = useState(false);
  // Artisan Modal State
  const [showArtisanModal, setShowArtisanModal] = useState(false);
  const [expertForm, setExpertForm] = useState({
    name: '',
    email: '',
    phone: '',
    need: 'Appointment',
    question: '',
    contactMethod: 'Phone',
  });
  const handleExpertInputChange = (e) => {
    const { name, value, type } = e.target;
    setExpertForm((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : value,
    }));
  };
  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/enquiryOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryForm,
          status: 'new',
          productId: product?._id,
          productPrice: product?.quantity?.variants[0].price,
          productImage: product?.gallery?.mainImage?.url || '',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit enquiry');
      }

      // Show thank you message
      setShowEnquiryModal(false);
      setShowThankYou(true);

      // Reset form
      setEnquiryForm({
        fullName: '',
        email: '',
        phone: '',
        productName: product?.title || '',
        message: '',
        contactMethod: 'Email',
      });

      toast.success('Enquiry submitted successfully!');

    } catch (error) {
      toast.error(error.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...expertForm,
        type: 'product',
        productId: product._id,
        queryName: product.title || ''
      };
      const res = await fetch('/api/askExpertsEnquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || 'Failed to submit your question.');
        return;
      }
      setShowExpertModal(false);
      setExpertForm({
        name: '',
        email: '',
        phone: '',
        need: 'Appointment',
        question: '',
        contactMethod: 'Phone',
      });
      toast.success('Your question has been submitted!');
    } catch (err) {
      toast.error('Failed to submit your question.');
    }
  };


  const router = useRouter();
  const [showShareBox, setShowShareBox] = React.useState(false);
  const [productUrl, setProductUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined" && product && product.slug) {
      setProductUrl(window.location.origin + "/product/" + product.slug);
    } else if (product && product.slug) {
      setProductUrl("/product/" + product.slug);
    }
  }, [product]);

  // Close share box when clicking outside
  React.useEffect(() => {
    if (!showShareBox) return;
    function handleClick(e) {
      const pop = document.getElementById("share-popover");
      if (pop && !pop.contains(e.target)) {
        setShowShareBox(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showShareBox]);

  // console.log(product)
  const [selectedImage, setSelectedImage] = React.useState(product?.gallery?.mainImage?.url || []);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    productName: product?.title || '',
    message: '',
    contactMethod: 'Email',
  });
  const [quantity, setQuantity] = React.useState(1);
  const [showSizeChart, setShowSizeChart] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [selectedWeight, setSelectedWeight] = React.useState(null);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const desc = product.description?.overview || "No Description";
  const words = desc.split(' ');

  const [pincodeResult, setPincodeResult] = React.useState(null);
  const [pincodeError, setPincodeError] = React.useState("");
  const [statesList, setStatesList] = useState([]);
  const [pincodeInput, setPincodeInput] = React.useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingPerUnit, setShippingPerUnit] = useState(null);

  // Restore delivery location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('deliveryLocation');
    if (saved) {
      const loc = JSON.parse(saved);
      setPincodeInput(loc.pincode);
      setPincodeResult(loc);
    }
  }, []);

  // Extract variants
  const variants = Array.isArray(product?.quantity?.variants) ? product.quantity.variants : [];
  // console.log(product?.quantity?.variants);

  // Get all unique sizes and colors from variants
  const availableSizes = [...new Set(variants.map(v => v.size))];
  const allColors = [...new Set(variants.map(v => v.color))];

  // Find the selected variant
  const selectedVariant = variants.find(v => {
    return (
      (selectedSize ? v.size === selectedSize : true) &&
      (selectedWeight ? v.weight === selectedWeight : true) &&
      (selectedColor ? v.color === selectedColor : true)
    );
  });
  // console.log(selectedVariant?.price);

  // Set default selection on mount or when variants change
  React.useEffect(() => {
    if (variants.length && !selectedSize && !selectedColor) {
      setSelectedSize(variants[0].size);
      setSelectedWeight(variants[0].weight);
      setSelectedColor(variants[0].color);
    }
  }, [variants]);

  // Cap quantity to available stock
  React.useEffect(() => {
    if (selectedVariant && quantity > selectedVariant.qty) {
      setQuantity(selectedVariant.qty);
    }
  }, [selectedVariant, quantity]);

  // Calculate total price
  const formatNumeric = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  const coupon = product.coupon || product.coupons?.coupon;
  let discountedPrice = selectedVariant ? selectedVariant.price : 0;
  let hasDiscount = false;
  let couponText = '';
  if (coupon && typeof coupon.percent === 'number' && coupon.percent > 0) {
    discountedPrice = selectedVariant.price - (selectedVariant.price * coupon.percent) / 100;
    hasDiscount = true;
    couponText = `${coupon.couponCode || ''} (${coupon.percent}% OFF)`;
  } else if (coupon && typeof coupon.amount === 'number' && coupon.amount > 0) {
    discountedPrice = selectedVariant?.price - coupon.amount;
    hasDiscount = true;
    couponText = `${coupon.couponCode || ''} (₹${coupon.amount} OFF)`;
  }
  const price = selectedVariant ? formatNumeric(selectedVariant.price) : 0;
  const total = hasDiscount ? (discountedPrice * quantity).toFixed(2) : (selectedVariant ? (selectedVariant.price * quantity).toFixed(2) : 0);
  // Get images from the selected variant or first available variant
  const getVariantImages = (variant) => {
    if (!variant) return ['/placeholder.jpeg'];

    const images = [];

    // Add profile image if exists
    if (variant.profileImage?.url) {
      images.push(variant.profileImage.url);
    }

    // Add all valid sub-images 
    if (Array.isArray(variant.subImages)) {
      variant.subImages.forEach(img => {
        if (img?.url && typeof img.url === 'string' && img.url.trim() !== '') {
          images.push(img.url);
        }
      });
    }
    return images.length > 0 ? images : ['/placeholder.jpeg'];
  };

  // Get images for the selected variant or first variant if none selected
  const [variantImages, setVariantImages] = useState(
    variants.length > 0 ? getVariantImages(variants[0]) : ['/placeholder.jpeg']
  );

  // Debug main image array and index
  // Embla carousel API and active image index for main image gallery
  const [carouselApi, setCarouselApi] = React.useState(null);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  // Update variant images when selected variant changes
  useEffect(() => {
    if (selectedVariant) {
      const images = getVariantImages(selectedVariant);
      setVariantImages(images);

      // Reset carousel to first image when variant changes
      if (carouselApi) {
        carouselApi.scrollTo(0);
      }
    }
  }, [selectedVariant, carouselApi]);

  const allImages = variantImages;
  React.useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      const idx = carouselApi.selectedScrollSnap();
      setActiveImageIdx(idx);
    };
    carouselApi.on('select', onSelect);
    setActiveImageIdx(carouselApi.selectedScrollSnap());
    return () => carouselApi.off('select', onSelect);
  }, [carouselApi]);

  useEffect(() => {
    // Fetch states/districts from API on mount
    const fetchStates = async () => {
      try {
        const res = await fetch('/api/zipcode');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setStatesList(data.data);
        }
      } catch (e) {
        setStatesList([]);
      }
    };

    fetchStates();
  }, []);


  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* LEFT: Product Images */}
      <div className="w-full md:w-1/3 flex flex-col items-center">

        {/* Main Image Carousel (QuickView style, embla-controlled) */}
        <div className="w-full flex justify-center mb-4">
          <div className="relative w-full max-w-[500px] h-[420px] md:h-[500px] flex items-center justify-center rounded-xl overflow-hidden">
            <Carousel
              className="w-full h-full pr-4"
              opts={{ loop: true }} // <--- This is the correct place to enable looping
              plugins={[Autoplay({ delay: 4000 })]}
              setApi={setCarouselApi}
            >
              <CarouselContent className="h-[420px] md:h-[500px]">
                {allImages.map((img, idx) => (
                  <CarouselItem key={idx} className="flex items-center justify-center h-full">
                    <div className="relative w-full h-[420px] md:h-[500px] flex items-center justify-center"
                    >
                      <Image
                        src={img}
                        alt={`Product image ${idx}`}
                        layout="fill"
                        objectFit="contain"
                        className="w-full h-full object-contain"
                        draggable={false}
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                          transition: 'transform 0.3s',

                        }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2 z-10 " />
              <CarouselPrevious className="!left-1 !top-1/2 !-translate-y-1/2 z-10" />
            </Carousel>
          </div>
        </div>
        {/* Sub-Images Carousel (5 per row) */}
        {allImages.length > 1 && (
          <div className="w-full max-w-[400px] mx-auto px-2">
            <Carousel opts={{ align: 'start', loop: allImages.length > 5 }} className="w-full">
              <CarouselContent>
                {allImages.map((img, idx) => (
                  <CarouselItem key={idx} className="flex justify-center basis-1/5 max-w-[20%] min-w-0">
                    <button
                      className={`rounded-lg border-2 ${activeImageIdx === idx ? 'border-black' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-black`}
                      onClick={() => carouselApi && carouselApi.scrollTo(idx)}
                      style={{ minWidth: 64, minHeight: 64 }}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumb ${idx + 1}`}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover w-16 h-16"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 5 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
        )}

      </div>
      {/* CENTER: Product Details/Description/Selectors */}
      <div className="w-full lg:w-1/3 max-w-xl mx-auto flex flex-col">
        <div className="flex items-center gap-4 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
        </div>
        {/* Product Code */}
        {product.code && (
          <span className="text-sm text-black my-2 w-fit font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">Code: {product.code}</span>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold flex items-center">
            {(() => {
              if (Array.isArray(product?.reviews) && product.reviews.length > 0) {
                const avg = product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length;
                return avg.toFixed(1);
              }
              return "0";
            })()} Rating</span>
          <span className="text-gray-700 text-sm">({product.reviews?.length || 0} customer reviews)</span>
        </div>
        {(() => {

          if (desc === "No Description") {
            return <p className="text-gray-700 mb-4 max-w-lg">No Description</p>;
          }
          if (showFullDesc || words.length <= 20) {
            return (
              <div className="text-gray-700 my-6 text-md max-w-lg">
                <div dangerouslySetInnerHTML={{ __html: desc }} />
                {words.length > 20 && (
                  <>
                    {' '}<button className="text-blue-600 underline ml-2" onClick={() => setShowFullDesc(false)}>Close</button>
                  </>
                )}
              </div>
            );
          }
          return (
            <div className="text-gray-700 my-4 text-sm md:text-md max-w-lg">
              <div dangerouslySetInnerHTML={{ __html: words.slice(0, 20).join(' ') + '...' }} />
              <button className="text-blue-600 underline" onClick={() => setShowFullDesc(true)}>Read more</button>
            </div>
          );
        })()}
        {/* Selectors */}
        {/* Price and Coupon Section */}
        <div className="mb-2 flex items-center gap-2">
          {hasDiscount && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-xl text-black">₹{formatNumeric(Math.round(discountedPrice))}</span>
              <del className="text-gray-600 font-semibold text-sm mr-2">₹{formatNumeric(selectedVariant?.price)}</del>
              <span className="border border-green-500 text-green-700 px-2 py-0.5 rounded text-xs font-semibold bg-green-50">Coupon Applied: {couponText}</span>
            </div>

          )}
          {!hasDiscount && (
            <span className="font-bold text-xl text-black">₹{price}</span>
          )}
        </div>
        {/* Stock Status */}
        {/* Quantity */}
        {(() => {
          const currentVariantInStock = selectedVariant?.qty > 0;

          if (currentVariantInStock) {
            return (
              <div className="flex items-center gap-2 my-4">
                <span className="font-bold text-md">Quantity:</span>
                <button
                  className="w-8 h-8 border rounded flex items-center justify-center font-bold text-lg hover:bg-gray-100"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  className="w-8 h-8 border rounded flex items-center justify-center font-bold text-lg hover:bg-gray-100"
                  onClick={() => setQuantity(q => Math.min(selectedVariant.qty, q + 1))}
                  aria-label="Increase quantity"
                  disabled={!selectedVariant || quantity >= selectedVariant.qty}
                >
                  +
                </button>
              </div>
            );
          } else {
            return (
              <div className="text-sm my-2 text-red-600 font-medium">
                This variant is currently out of stock
              </div>
            );
          }
        })()}
        <div className="flex flex-col gap-4 mb-6">
          {/* Quantity */}
          {product?.quantity?.varients?.[0].qty > 0 && (

            <div className="flex items-center gap-2">
              <span className="font-bold text-md">Quantity:</span>
              <button
                className="w-8 h-8 border rounded flex items-center justify-center font-bold text-lg hover:bg-gray-100"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                className="w-8 h-8 border rounded flex items-center justify-center font-bold text-lg hover:bg-gray-100"
                onClick={() => setQuantity(q => selectedVariant ? Math.min(selectedVariant.qty, q + 1) : q + 1)}
                aria-label="Increase quantity"
                disabled={!selectedVariant || quantity >= (selectedVariant?.qty || 0)}
              >
                +
              </button>
            </div>
          )}
          {/* Size */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-md">Size:</span>
            {availableSizes.map((size, idx) => {
              const variant = variants.find(v => v.size === size);
              const weight = variant?.weight || "N/A"; // fallback if weight is not available

              return (
                <button
                  key={size || idx}
                  className={`relative min-w-24 px-3 py-2 border rounded-xl bg-white text-sm font-medium transition-all duration-150
          ${selectedSize === size ? 'border-black ring-1 ring-black' : 'border-gray-300'}
          hover:bg-gray-100
        `}
                  onClick={() => {
                    setSelectedSize(size);
                    setQuantity(1);
                    // Get all colors for this size
                    const colorsForSize = variants.filter(v => v.size === size).map(v => v.color);
                    const newColor = colorsForSize.includes(selectedColor) ? selectedColor : colorsForSize[0];
                    setSelectedColor(newColor);
                    // Get weight for size+color
                    const weightForSize = variants.find(v => v.size === size && v.color === newColor)?.weight;
                    setSelectedWeight(weightForSize);
                  }}
                  aria-pressed={selectedSize === size}
                  tabIndex={0}
                >
                  <div className="flex justify-between items-center w-full gap-2">
                    <span>{size}</span>
                    <div className="h-4 w-px bg-gray-300" />
                    <span className="text-gray-600 text-md">{weight}g</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Size Chart Link/Button */}
          <div className="flex gap-4 items-center">
            {product?.size?.sizeChartUrl?.url && (
              <>
                <span
                  className="ml-3 text-black cursor-pointer hover:underline text-base flex items-center gap-2"
                  onClick={() => setShowSizeChart(true)}
                >
                  <Ruler />
                  Size Chart
                </span>
                {/* Modal for Size Chart */}
                {showSizeChart && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSizeChart(false)}>
                    <div className="bg-white rounded-lg p-4 shadow-xl max-w-md w-full relative" onClick={e => e.stopPropagation()}>
                      <button
                        className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-black focus:outline-none"
                        onClick={() => setShowSizeChart(false)}
                        aria-label="Close size chart"
                      >
                        &times;
                      </button>
                      <img src={product?.size?.sizeChartUrl?.url} alt="Size Chart" className="w-full h-auto rounded-lg" />
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Ask An Expert Button */}
            <button
              className="text-black hover:underline w-fit text-base flex items-center gap-2"
              onClick={() => setShowExpertModal(true)}
            >
              <Mail />
              Ask An Expert
            </button>
            {/* Ask An Expert Modal */}
            {showExpertModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in h-[90vh] md:h-fit overflow-y-auto">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-4xl font-bold"
                    onClick={() => setShowExpertModal(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-xl font-bold mb-2 text-center">Ask An Expert</h2>
                  <form onSubmit={handleExpertSubmit} className="flex flex-col gap-4">
                    <div className="text-center text-gray-500 text-sm mb-2">We will follow up with you via email within 24–36 hours</div>
                    <hr className="" />
                    <div className="text-center text-base mb-2">Please answer the following questionnaire</div>
                    <input
                      type="text"
                      name="name"
                      value={expertForm.name}
                      onChange={handleExpertInputChange}
                      placeholder="Your Name"
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={expertForm.email}
                      onChange={handleExpertInputChange}
                      placeholder="Email Address"
                      className="border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      name="phone"
                      value={expertForm.phone}
                      onChange={handleExpertInputChange}
                      placeholder="Phone Number"
                      className="border rounded px-3 py-2"
                      required
                    />
                    <div className="flex flex-row gap-6 items-center mt-2">
                      <span className="text-sm">Do You Need</span>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="need"
                          value="Appointment"
                          checked={expertForm.need === 'Appointment'}
                          onChange={handleExpertInputChange}
                          required
                        /> Appointment
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="need"
                          value="Business"
                          checked={expertForm.need === 'Business'}
                          onChange={handleExpertInputChange}
                          required
                        /> Business
                      </label>
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name="need"
                          value="Personal"
                          checked={expertForm.need === 'Personal'}
                          onChange={handleExpertInputChange}
                        /> Personal
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">What Can I Help You With Today?</label>
                      <textarea
                        name="question"
                        value={expertForm.question}
                        onChange={handleExpertInputChange}
                        placeholder="Describe your question or issue"
                        className="border rounded px-3 py-2 w-full h-24 "
                        rows={4}
                        required
                      />
                    </div>
                    <div className="mt-2">
                      <span className="block text-sm mb-1">How Would You Like Me To Contact You?</span>
                      <div className="flex flex-row gap-6">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name="contactMethod"
                            value="Phone"
                            checked={expertForm.contactMethod === 'Phone'}
                            onChange={handleExpertInputChange}
                          /> Phone
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name="contactMethod"
                            value="Email"
                            checked={expertForm.contactMethod === 'Email'}
                            onChange={handleExpertInputChange}
                          /> Email
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="radio"
                            name="contactMethod"
                            value="Both"
                            checked={expertForm.contactMethod === 'Both'}
                            onChange={handleExpertInputChange}
                          /> Both
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-black text-white rounded px-6 py-2 font-bold hover:bg-gray-900 transition mt-2"
                    >
                      SEND QUESTION
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          {/* Color */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-md">Color:</span>
            {allColors.map((color, idx) => {
              // Only enable colors that are available for the selected size
              const enabled = selectedSize ? variants.some(v => v.color === color && v.size === selectedSize) : false;
              return (
                <button
                  key={color || idx}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-150
          ${selectedColor === color ? 'border-black ring-1 ring-black' : ''}
          ${!enabled ? 'border-gray-300 opacity-40 cursor-not-allowed' : 'hover:ring-2 hover:ring-black'}
        `}
                  style={{ background: color, position: 'relative' }}
                  title={color}
                  onClick={() => {
                    if (!enabled) return;
                    setSelectedColor(color);
                    setQuantity(1);
                  }}
                  aria-disabled={!enabled}
                  tabIndex={enabled ? 0 : -1}
                >
                  {(!enabled) && (
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40">
                      <line x1="5" y1="35" x2="35" y2="5" stroke="#e57373" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          {/* Pincode check UI */}
          <div className="">
            <div className="flex items-center gap-2 my-2">
              <span className="text-base font-medium flex items-center gap-1">
                <MapPin size={18} className="inline-block" />
                Delivery Options
              </span>
            </div>
            {!pincodeResult ? (
              <div className="border rounded px-4 py-3 flex items-center gap-2 bg-white max-w-xs">
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-gray-700"
                  placeholder="Enter pincode"
                  value={pincodeInput}
                  onChange={e => setPincodeInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                />
                <button
                  className="text-blue-900 font-semibold ml-2"
                  disabled={loadingShipping || pincodeInput.length !== 6}
                  onClick={async () => {
                    setPincodeError('');
                    setLoadingShipping(true);
                    setPincodeResult(null);
                    try {
                      // You may want to auto-detect state/district from another API if needed.
                      // Here, we assume checkZip API can find from just pincode.
                      const res = await fetch('/api/zipcode/checkZip', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pincode: pincodeInput }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setPincodeResult(data);
                        setPincodeError("");
                        // Persist delivery location to localStorage
                        localStorage.setItem('deliveryLocation', JSON.stringify({
                          pincode: data.pincode,
                          city: data.city,
                          state: data.state,
                          district: data.district
                        }));
                      } else {
                        setPincodeError(data.message || 'Delivery not available');
                      }
                    } catch {
                      setPincodeError('Server error. Please try again.');
                    } finally {
                      setLoadingShipping(false);
                    }
                  }}
                >
                  {loadingShipping ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2" />
                      Checking...
                    </span>
                  ) : (
                    'Check'
                  )}

                </button>
              </div>
            ) : (
              <div className="border rounded px-4 py-3 bg-white w-fit">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="inline-block" />
                  <span className="font-semibold">Delivery options for {pincodeResult.pincode}</span>
                  <button
                    className="ml-auto px-2 py-1 border rounded border-black text-sm"
                    onClick={() => {
                      setPincodeInput('');
                      setPincodeResult(null);
                    }}
                  >
                    Change
                  </button>
                </div>
                <div className="mb-1 text-sm">
                  Shipping to: <span className="font-semibold">{pincodeResult.city || pincodeResult.district}, {pincodeResult.state}, India</span>
                </div>
              </div>
            )}
            {pincodeError && (
              <div className="text-red-600 text-xs mt-1">{pincodeError}</div>
            )}
          </div>
          {/* Tags, etc. */}
          {product.categoryTag && (
            <div className="mb-4">
              <div className="text-sm mb-1">
                <span className="block font-semibold text-lg mb-2">Category:</span>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {Array.isArray(product.categoryTag?.tags) && product.categoryTag.tags.length > 0 ? (
                    product.categoryTag.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No categories</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* RIGHT: Price/Offers/Add to Cart Box */}
      <div className="w-full lg:w-1/3 flex flex-col">
        <div className="border rounded-xl p-6">
          {/* Total Price */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-bold text-xl">Total</span>
            <span className="font-bold text-2xl">₹ {total}</span>
          </div>
          {/* Offers/Info Boxes */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="border rounded-lg p-3 flex items-center justify-between">
              <span className="font-semibold">Fast Delivery</span>
              <span className="text-gray-500 text-xs w-52">The specific delivery time will vary depending on the shipping address and the selected delivery options.</span>
            </div>
            <div className="border rounded-lg p-3 flex items-center justify-between">
              <span className="font-semibold">Easy Returns</span>
              <span className="text-gray-500">Within 30 days of purchase</span>
            </div>
            <div className="border rounded-lg p-3 flex items-center justify-between">
              <span className="font-semibold">24/7 support</span>
              <span className="text-gray-500 text-xs w-52">Service support is availble 24 hours a day. 7 days a week. You can reach them by phone,email, or chat</span>
            </div>
            <div className="border rounded-lg p-3 flex items-center justify-between gap-2">
              <span className="font-semibold">Payment & Security</span>
              <span className="text-gray-500 text-xs w-52">Your payment information is processed securly. We do not store credit card details nor have access to your credit card infomation</span>
            </div>
            <h2 className="font-bold mx-auto">"Shop with Confidence - 100% Money-Back Guarantee!"</h2>
          </div>
          <div className="py-2">
            <button
              className="bg-black text-white py-3 px-8 font-semibold hover:bg-gray-800 w-full"
              onClick={() => setShowPdfModal(true)}
            >
              Get Package PDF
            </button>
            {/* PDF Modal */}
            <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
              <DialogContent className="max-w-lg">
                <DialogTitle>Package PDFs</DialogTitle>
                {Array.isArray(product.pdfs) && product.pdfs.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {product.pdfs.map((pdf, idx) => (
                      <div key={pdf._id || pdf.key || idx} className="flex items-center justify-between py-2 gap-2">
                        <span className="font-medium text-gray-800">{pdf.name}</span>
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-semibold"
                            onClick={() => setPdfPreviewUrl(pdf.url)}
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* PDF Preview Modal */}
                    <Dialog open={!!pdfPreviewUrl} onOpenChange={() => setPdfPreviewUrl(null)}>
                      <DialogContent className="md:max-w-2xl">
                        <DialogTitle>PDF Preview</DialogTitle>
                        {pdfPreviewUrl && (
                          <iframe
                            className="h-[500px]"
                            src={pdfPreviewUrl}
                            width="100%"
                            height="600px"
                            style={{ border: '1px solid #ccc', borderRadius: 8 }}
                            title="Package PDF Preview"
                          />
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Close</button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="text-gray-500 py-4">No PDFs available for this package.</div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">Close</button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="py-2">
            <button
              className="bg-black text-white py-3 px-8 font-semibold hover:bg-gray-800 w-full"
              onClick={() => setShowEnquiryModal(true)}
            >
              Enquiry Now
            </button>
          </div>

          {/* Enquiry Modal */}
          <Dialog open={showEnquiryModal} onOpenChange={(open) => !open && setShowEnquiryModal(false)}>
            <DialogContent
              className="max-w-4xl"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DialogTitle className="text-2xl font-bold mb-2">Enquiry Form for {product?.title}</DialogTitle>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side - Form */}
                <form onSubmit={handleEnquirySubmit} className="space-y-2">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={enquiryForm.fullName}
                      onChange={handleEnquiryChange}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={enquiryForm.email}
                      onChange={handleEnquiryChange}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="number"
                      pattern="[0-9]*"
                      id="phone"
                      name="phone"
                      value={enquiryForm.phone}
                      onChange={handleEnquiryChange}
                      placeholder="Enter your contact number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                      Product of Interest *
                    </label>
                    <input
                      type="text"
                      id="productName"
                      name="productName"
                      value={enquiryForm.productName}
                      onChange={handleEnquiryChange}
                      placeholder="Enter the product name or ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black cursor-not-allowed"
                      required
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Enquiry *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={enquiryForm.message}
                      onChange={handleEnquiryChange}
                      placeholder="Please describe your enquiry or requirements"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method (optional)
                    </label>
                    <div className="space-y-2">
                      {['Email', 'Phone', 'WhatsApp'].map((method) => (
                        <label key={method} className="flex items-center">
                          <input
                            type="radio"
                            name="contactMethod"
                            value={method}
                            checked={enquiryForm.contactMethod === method}
                            onChange={handleEnquiryChange}
                            className="h-4 w-4 text-black focus:ring-black"
                          />
                          <span className="ml-2 text-gray-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-6 font-semibold hover:bg-gray-800 rounded-md transition-colors"
                  >
                    Submit Enquiry
                  </button>
                </form>

                {/* Right Side - Product Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="flex gap-4">
                    {product?.gallery?.mainImage?.url && (
                      <div className="mb-4">
                        <Image
                          src={product.gallery?.mainImage?.url}
                          alt={product.title || 'Product Image'}
                          width={300}
                          height={100}
                          className="w-44 h-44 rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">

                      {product.code && (
                        <span className="text-sm text-black my-2 w-fit font-mono bg-gray-100 px-2 py-1 rounded border border-gray-200">Code: {product.code}</span>
                      )}
                      <h4 className="font-semibold text-xl text-gray-900 flex-wrap">Name: {product?.title || 'Product Name'}</h4>
                      {product?.quantity && (
                        <p className="text-lg font-semibold text-gray-900 mt-2">Price:
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0,
                          }).format(product.quantity?.variants[0]?.price)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-600">
                      Our team is here to help with any questions you have about this product.
                    </p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Call Us:</span> <a href="tel:+911352442822" className="text-blue-600 hover:underline">+91 1352442822</a>, <a href="tel:+917669280002" className="text-blue-600 hover:underline">+91 7669280002</a>, <a href="tel:+919897468886" className="text-blue-600 hover:underline">+91 9897468886</a>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> <a href="mailto:info@protosadventures.com" className="text-blue-600 hover:underline">info@protosadventures.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Thank You Modal */}
          <Dialog open={showThankYou} onOpenChange={(open) => !open && setShowThankYou(false)}>
            <DialogContent
              className="max-w-md"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <DialogTitle className="sr-only">Thank You</DialogTitle>
              <div className="text-center py-2">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for submitting your product enquiry.
                  We appreciate your interest and want to assure you that one of our support executives
                  will get back to you shortly with the information you need. If you have any additional
                  questions in the meantime, feel free to reach out.
                </p>
                <div className="bg-gray-50 p-4 rounded-md text-left">
                  <h4 className="font-medium text-gray-900 mb-2">For More Info</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Call Us:</span> <a href="tel:+911352442822" className="text-blue-600 hover:underline">+91 1352442822</a>, <a href="tel:+917669280002" className="text-blue-600 hover:underline">+91 7669280002</a>, <a href="tel:+919897468886" className="text-blue-600 hover:underline">+91 9897468886</a>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Or Email:</span> <a href="mailto:info@protosadventures.com" className="text-blue-600 hover:underline">info@protosadventures.com</a>
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                    onClick={() => setShowThankYou(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div >

  );
}