'use client'
import { useEffect, useState } from 'react';
import API from '../utils/api';
import Link from 'next/link';

const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    const res = await API.get('/items', {
      params: { search },
    });
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await API.delete(`/items/${id}`);
      fetchItems();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Item List</h1>
        <Link href="/create" className="bg-green-500 text-white p-2 rounded">+ Create</Link>
      </div>
      <input
        className="border p-2 mb-5 w-full"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.type}</td>
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">${item.price}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;