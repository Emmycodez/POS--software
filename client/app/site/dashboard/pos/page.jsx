import React from 'react'
import POSSystem from './_components/PosClient'
import { getPosProducts } from '@/actions/serverActions'

const PosPage = async () => {
  const data = await getPosProducts();
  return (
    <POSSystem data={data}/>
  )
}

export default PosPage