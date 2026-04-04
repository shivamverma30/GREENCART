import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCart from '../components/ProductCart'; 
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';

const AllProducts = () => {
  const { products, searchQuery, productsLoading, navigate } = useAppContext();
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const categories = ['All', ...new Set(products.map((item) => item.category))];

  const maxProductPrice = Math.max(...products.map((item) => item.offerPrice || 0), 2000);

  useEffect(() => {
    setMaxPrice(maxProductPrice);
  }, [maxProductPrice]);

  const categoryFilteredProducts = filterProducts.filter((product) => {
    if (selectedCategory === 'All') return true;
    return product.category === selectedCategory;
  });

  const visibleProducts = [...categoryFilteredProducts]
    .filter((product) => {
      const inStock = product.inStock !== false;
      if (showInStockOnly && !inStock) return false;
      if (localSearch && !product.name.toLowerCase().includes(localSearch.toLowerCase())) return false;
      return product.offerPrice <= maxPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'priceLowToHigh') return a.offerPrice - b.offerPrice;
      if (sortBy === 'priceHighToLow') return b.offerPrice - a.offerPrice;
      if (sortBy === 'popularity') return (b.rating || 4.1) - (a.rating || 4.1);
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'nameAZ') return a.name.localeCompare(b.name);
      return 0;
    });

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilterProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilterProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className='mt-12 flex flex-col gap-6'>
      <SectionHeader
        title='All Products'
        subtitle={productsLoading ? 'Loading catalog...' : `${visibleProducts.length} products available`}
        rightContent={
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='glass-surface rounded-lg px-3 py-2 text-sm outline-none'
          >
            <option value='relevance'>Sort: Relevance</option>
            <option value='priceLowToHigh'>Price: Low to High</option>
            <option value='priceHighToLow'>Price: High to Low</option>
            <option value='popularity'>Sort: Popularity</option>
            <option value='newest'>Sort: Newest</option>
          </select>
        }
      />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]'>
        <GlassCard className='h-max rounded-2xl p-4'>
          <h3 className='text-lg font-semibold'>Filters</h3>

          <div className='mt-5'>
            <p className='text-sm font-medium'>Search</p>
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className='mt-2 w-full rounded-md border border-white/20 bg-white/40 px-3 py-2 text-sm text-muted outline-none dark:bg-white/5'
              placeholder='Search this category'
            />
            {searchQuery && <p className='mt-2 text-xs text-muted'>Global search active: {searchQuery}</p>}
          </div>

          <div className='mt-5'>
            <p className='text-sm font-medium'>Categories</p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-xs border transition ${
                    selectedCategory === category
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300/60 hover:border-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5'>
            <p className='text-sm font-medium'>Price Range</p>
            <input
              type='range'
              min={0}
              max={maxProductPrice}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className='mt-3 w-full cursor-pointer accent-primary'
            />
            <p className='mt-1 text-xs text-muted'>Up to Rs. {maxPrice}</p>
          </div>

          <label className='mt-5 flex cursor-pointer items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
              className='accent-primary'
            />
            In-stock only
          </label>
        </GlassCard>

        <div className='grid grid-cols-1 gap-x-5 gap-y-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {productsLoading && Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className='h-[320px] animate-pulse rounded-xl border border-white/20 bg-white/40 p-4 dark:bg-white/5'>
            <div className='h-40 rounded-lg bg-gray-200'></div>
            <div className='mt-4 h-4 w-1/3 rounded bg-gray-200'></div>
            <div className='mt-2 h-5 w-3/4 rounded bg-gray-200'></div>
            <div className='mt-5 h-8 rounded bg-gray-200'></div>
          </div>
        ))}

        {!productsLoading && visibleProducts.map((product) => (
            <ProductCart key={product._id} product={product} />
          ))}
        </div>
      </div>

      {!productsLoading && visibleProducts.length === 0 && (
        <EmptyState
          title='No matching products'
          description={products.length === 0 ? 'Catalog is empty. Showing nothing yet.' : 'Try changing category, price range, or stock filter.'}
          actionLabel='Back to Home'
          onAction={() => navigate('/')}
        />
      )}
    </div>
  );
};

export default AllProducts;
