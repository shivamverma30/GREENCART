import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import { useAppContext } from '../context/AppContext'
import ProductCart from '../components/ProductCart'
import SectionHeader from '../components/ui/SectionHeader'

const Home  = () => {
  const { products } = useAppContext();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className='mt-10 space-y-16'>
       <MainBanner/>
       <Categories/>
       <BestSeller/>

       <section className='animate-rise'>
        <SectionHeader
          title='Featured This Week'
          subtitle='Handpicked picks with top ratings and fast delivery'
        />
        <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {featuredProducts.map((item) => (
            <ProductCart key={item._id} product={item} />
          ))}
        </div>
       </section>

       <BottomBanner/>
       <NewsLetter/>
    </div>
  )
}

export default Home
