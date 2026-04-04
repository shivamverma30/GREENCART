import React from 'react'
import { categories } from '../assets/assets';
import {useAppContext} from '../context/AppContext'
import SectionHeader from './ui/SectionHeader';

const Categories = () => {
    const {navigate} = useAppContext();
return (
  <div className='mt-16 animate-rise'>
    <SectionHeader title='Shop By Category' subtitle='Find your daily essentials in seconds' />
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
      {categories.map((category, index) => (
        <div
          key={index}
          className='category-card group cursor-pointer rounded-2xl px-3 py-5 gap-2 flex flex-col justify-center items-center transition'
          style={{ backgroundColor: category.bgColor }}
          onClick={() => {
            navigate(`/products/${category.path.toLowerCase()}`);
            scrollTo(0,0)
          }}
        >
          <img
            src={category.image}
            alt={category.text}
            className='max-w-28 transition duration-300 group-hover:scale-105'
          />
          <p className='category-card-title text-center text-sm font-semibold leading-5'>{category.text}</p>
        </div>
      ))}
    </div>
  </div>
);
}

export default Categories
