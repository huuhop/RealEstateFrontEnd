'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import API from '@/utils/api'
import { BASE_URL } from '@/config'

type ItemFormProps = {
  itemId?: number
}

export default function ItemForm({ itemId }: ItemFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    type: '',
    category: '',
    price: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const res = await API.get(`/item/${itemId}`)
          const data = res.data
          setForm({
            name: data.name,
            type: data.type,
            category: data.category,
            price: data.price.toString(),
          })
          setCurrentImage(data.imageUrl || null) 
        } catch (err) {
          toast.error('Failed to load item details')
        }
      }
      fetchItem()
    }
  }, [itemId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let res
      if (itemId) {
        res = await API.patch(`/item/${itemId}`, {
          name: form.name,
          type: form.type,
          category: form.category,
          price: parseFloat(form.price),
        });
      } else {
        res = await API.post('/item', {
          name: form.name,
          type: form.type,
          category: form.category,
          price: parseFloat(form.price),
        })
      }
      const newItem = res.data
      toast.success(itemId ? 'Item updated successfully!' : 'Item created successfully!')

      if (file && newItem.id) {
        const fd = new FormData()
        fd.append('file', file)
        await API.post(`/upload/${newItem.id}/image`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('File uploaded successfully!')
      }

      router.push('/')
    } catch (err: any) {
      console.error('Error:', err)
      toast.error(err?.response?.data?.message || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-5">{itemId ? 'Update Item' : 'Create New Item'}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="type"
          value={form.type}
          placeholder="Type"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          placeholder="Category"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {currentImage && (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Current Image:</p>
            <img
              src={`${BASE_URL}${currentImage}`}
              alt="Current"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          {loading ? 'Saving...' : itemId ? 'Update' : 'Save'}
        </button>
      </form>
    </div>
  )
}