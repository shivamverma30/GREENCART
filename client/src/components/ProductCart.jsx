
 import React, { memo } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import { getProductImage } from "../utils/image";

const ProductCart = ({product}) => {
    const {currency,addToCart,removeFromCart,cartItems,navigate} =useAppContext()
    const discount = Math.max(0, Math.round(((product.price - product.offerPrice) / (product.price || 1)) * 100));
    const isInStock = product.inStock !== false;
    const rating = product.rating || 4.2;
    const imageSrc = getProductImage(product, assets.upload_area);
    const namedFallbackImage = getProductImage({ name: product?.name, image: null }, assets.upload_area);


    return product && (
        <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0,0)}} className="product-card group animate-rise relative w-full cursor-pointer overflow-hidden rounded-2xl p-4 transition duration-300">
            <div className="product-image-container relative">
                {discount > 0 && (
                    <Badge className="absolute left-3 top-3 z-10 bg-emerald-600 text-white shadow">
                        {discount}% OFF
                    </Badge>
                )}

                {!isInStock && (
                    <Badge className="product-stock-badge absolute right-3 top-3 z-10">
                        Out of stock
                    </Badge>
                )}
                <img
                  loading="lazy"
                  src={imageSrc || assets.upload_area}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                                        e.currentTarget.src = namedFallbackImage || assets.upload_area;
                  }}
                  className="product-image transition duration-300 group-hover:scale-105"
                  alt={product.name}
                />
            </div>

            <div className="mt-4 text-sm text-theme-secondary">
                <p className="text-xs font-semibold uppercase tracking-wide text-theme-secondary">{product.category}</p>
                <p className="mt-1 truncate text-base font-semibold text-theme-primary">{product.name}</p>
                <div className="mt-2 flex items-center gap-0.5 text-amber-500">
                    {Array(5).fill('').map((_, i) => (
                           <img key={i} className="md:w-3.5 w3" src={i<4?assets.star_icon:assets.star_dull_icon} alt="" />
                    ))}
                    <p className="ml-1 text-xs text-theme-secondary">({rating.toFixed(1)})</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-theme-primary leading-none">
                       {currency}{product.offerPrice.toLocaleString()} <span className="ml-1 text-xs font-medium text-theme-secondary line-through">{currency}{product.price.toLocaleString()}</span>
                    </p>

                    <div onClick={(e)=>{e.stopPropagation();}}  className="text-primary">
                        {!cartItems[product._id] && isInStock ? (
                            <Button className="h-[36px] w-[92px] gap-1 rounded-full px-0 text-xs shadow-[0_8px_18px_rgba(79,191,139,0.35)]" onClick={() => addToCart(product._id)} >
                                <img src={assets.cart_icon} alt="cart_icon" />
                                Add
                            </Button>
                        ) : cartItems[product._id] ? (
                            <div className="flex h-[34px] w-20 select-none items-center justify-center gap-2 rounded-md bg-primary/20 dark:bg-primary/30">
                                <button onClick={() => {removeFromCart(product._id)}} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() =>{addToCart(product._id)}} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        ) : (
                            <span className="rounded border border-theme bg-theme-card px-3 py-2 text-xs text-theme-secondary">Unavailable</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCart);