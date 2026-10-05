import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col">
      <div className="w-full h-48 bg-slate-200 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
      <div className="mt-auto flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-9 w-9 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-slate-200 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-16" />
    </div>
  );
};

export default ProductCardSkeleton;
