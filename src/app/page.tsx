"use client";
import { useEffect, useState, FormEvent } from "react";
import { ref, push, set, onValue, update, remove } from "firebase/database";
import { database } from "@/utils/firebase";

interface Item {
  id: string;
  name: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState<string>("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Fetch items from Firebase Realtime Database and listen for updates
  useEffect(() => {
    const itemsRef = ref(database, "items");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemsList = data
        ? Object.keys(data).map((key) => ({ id: key, name: data[key].name }))
        : [];
      setItems(itemsList);
    });
  }, []);

  // Handle form submission for adding or updating an item
  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();

    if (newItemName.trim() === "") return;

    if (editingItem) {
      // Update existing item
      const itemRef = ref(database, `items/${editingItem.id}`);
      await update(itemRef, { name: newItemName });
      setEditingItem(null);
    } else {
      // Add a new item
      const itemsRef = ref(database, "items");
      const newItemRef = push(itemsRef);
      await set(newItemRef, { name: newItemName });
    }

    setNewItemName("");
  };

  // Handle editing an item
  const handleEditItem = (item: Item) => {
    setNewItemName(item.name);
    setEditingItem(item);
  };

  // Handle deleting an item
  const handleDeleteItem = async (id: string) => {
    const itemRef = ref(database, `items/${id}`);
    await remove(itemRef);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">Item List</h1>
      <form
        onSubmit={handleAddItem}
        className="w-full max-w-md bg-white p-6 rounded shadow-md"
      >
        <div className="mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item Name"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            {editingItem ? "Update" : "Add"} Item
          </button>
          {editingItem && (
            <button
              onClick={() => setEditingItem(null)}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="mt-8 w-full max-w-md">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-white p-4 mb-2 rounded shadow-sm"
          >
            <span className="text-lg">{item.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEditItem(item)}
                className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
