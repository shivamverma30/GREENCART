import React from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import SectionHeader from '../../components/ui/SectionHeader';
import GlassCard from '../../components/ui/GlassCard';

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
        <SectionHeader title='Product Management' subtitle='View and update your product inventory' />
        <GlassCard className="mt-4 flex max-w-4xl w-full flex-col items-center overflow-hidden rounded-xl">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="seller-table-head text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="seller-table-body text-sm">
              {products && products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="border-t border-theme">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="rounded border border-theme bg-theme-card p-2">
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
                        <div className="h-7 w-12 rounded-full bg-slate-300 transition duration-300 peer-checked:bg-primary peer-focus:ring-4 peer-focus:ring-primary/25"></div>
                        <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 peer-checked:translate-x-5"></div>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-theme-secondary">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProductList;
