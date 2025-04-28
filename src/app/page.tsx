'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
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

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | undefined>()
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (sortBy) {
        params.sortBy = sortBy
        params.sortOrder = sortOrder
      }

      const res = await API.get('/item', { params }) // ✅ dùng API.get
      setItems(res.data)
    } catch (error) {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [sortBy, sortOrder])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await API.delete(`/item/${id}`) 
      toast.success('Item deleted successfully!')
      fetchItems()
    } catch (error) {
      toast.error('Failed to delete item!')
    }
  }

  const toggleSort = (field: 'name' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortOrder('ASC')
    }
  }

  const renderSortIcon = (field: 'name' | 'price') => {
    const isActive = sortBy === field
    return (
      <span className="ml-1 inline-flex flex-col text-gray-400 text-xs">
        <span
          className={`leading-none ${isActive && sortOrder === 'ASC' ? 'text-green-500' : ''
            }`}
        >
          ▲
        </span>
        <span
          className={`leading-none ${isActive && sortOrder === 'DESC' ? 'text-green-500' : ''
            }`}
        >
          ▼
        </span>
      </span>
    )
  }

  const handleSearch = () => {
    fetchItems()
  }

  const handleCreateNew = () => {
    router.push('/create')
  }

  const handleViewDetail = (id: number) => {
    router.push(`/item/${id}`)
  }

  const handleUpdate = (id: number) => {
    router.push(`/update/${id}`)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Search
        </button>
        <button
          onClick={handleCreateNew}
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Create New
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => toggleSort('name')}
              >
                Name {renderSortIcon('name')}
              </th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Category</th>
              <th
                className="border p-2 cursor-pointer select-none"
                onClick={() => toggleSort('price')}
              >
                Price {renderSortIcon('price')}
              </th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.type}</td>
                <td className="border p-2">{item.category}</td>
                <td className="border p-2">{item.price}</td>
                <td className="border p-2">
                  {item.imageUrl ? (
                    <img
                      src={`${BASE_URL}${item.imageUrl}`}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handleViewDetail(item.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
                  >
                    View Detail
                  </button>
                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}