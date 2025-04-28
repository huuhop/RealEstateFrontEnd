'use client'

import { useParams } from 'next/navigation' 
import ItemForm from '@/components/ItemForm'

export default function UpdateItemPage() {
  const { id } = useParams()  

  if (!id || Array.isArray(id)) {
    return <div>Invalid or missing ID</div> 
  }

  return (
    <div>
      <ItemForm itemId={parseInt(id)} />
    </div>
  )
}