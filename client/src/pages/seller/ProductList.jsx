import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { products, currency,axios,fetchProducts } = useAppContext();

  const toggleStock = async (id,inStock)=>{
    try {
      const {data} = await axios.post('/api/product/stock',{id,inStock});
      if(data.success){
        fetchProducts();
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products && products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded p-2">
                        <img
                          src={prod.image?.[0]}
                          alt="Product"
                          className="w-16"
                        />
                      </div>
                      <span className="truncate max-sm:hidden w-full">{prod.name}</span>
                    </td>
                    <td className="px-4 py-3">{prod.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {currency}
                      {prod.offerPrice}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input onClick={()=>toggleStock(prod._id, !prod.inStock)}
                         checked={prod.inStock}
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-12 h-7 bg-slate-300 peer-checked:bg-blue-600 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 transition duration-300"></div>
                        <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-gray-400">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
