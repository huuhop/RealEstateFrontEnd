'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import API from '@/utils/api'
import { BASE_URL } from '@/config'

type Item = {
  id: number
  name: string
  type: string
  category: string
  price: number
  imageUrl?: string
}

export default function ItemDetail() {
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    if (!id) return
    const fetchItem = async () => {
      setLoading(true)
      try {
        const res = await API.get(`/item/${id}`) 
        setItem(res.data)
      } catch (error) {
        toast.error('Failed to load item details')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-5">Item Details</h1>
      {item ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Price:</strong> ${item.price}</p>
            </div>
            <div className="w-1/2">
              <p><strong>Image:</strong></p>
              <img
                src={`${BASE_URL}${item.imageUrl}`}
                alt={item.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
          >
            Back to List
          </button>
        </div>
      ) : (
        <p>Item not found</p>
      )}
    </div>
  )
}