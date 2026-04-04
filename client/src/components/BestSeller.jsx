import React from 'react';
import ProductCart from './ProductCart';
import { useAppContext } from '../context/AppContext';
import SectionHeader from './ui/SectionHeader';

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <div className='mt-16 animate-rise'>
      <SectionHeader title='Best Sellers' subtitle='Most loved picks by our customers' />

      <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {products
            .filter((product) => product.inStock !== false)
            .slice(0, 4)
            .map((product, index) => (
              <ProductCart key={index} product={product} />
            ))}
      </div>
    </div>
  );
};

export default BestSeller;
