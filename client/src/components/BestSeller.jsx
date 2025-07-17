import React from 'react';
import ProductCart from './ProductCart';
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      
      {/* Horizontal Scroll Container */}
      <div className='overflow-x-auto mt-6'>
        <div className='flex gap-4 min-w-[1000px]'>
          {products
            .filter((product) => product.inStock)
            .slice(0, 5)
            .map((product, index) => (
              <ProductCart key={index} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
