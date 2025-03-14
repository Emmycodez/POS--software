import React from 'react'
import AddSupplier from './_components/AddSupplier'

const Suppliers = () => {
  return (
    <div className="h-screen py-4 px-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold uppercase">Products Page</h1>
      </div>
      <div>
        <AddSupplier/>
      </div>
    </div>
    <div>
      {/* Products Table */}
      <ProductsTable/>
    </div>
  </div>
  )
}

export default Suppliers