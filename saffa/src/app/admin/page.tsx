'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package, Testimonial, PackageCategory } from '@/lib/types';
import { AdminView } from '@/components/views/admin-view';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Package State
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [departureLocation, setDepartureLocation] = useState('Hyderabad');
  const [distanceFromHaram, setDistanceFromHaram] = useState('');
  const [distanceFromMasjidENabawi, setDistanceFromMasjidENabawi] = useState('');
  const [category, setCategory] = useState<PackageCategory>('Economy');
  const [agentName, setAgentName] = useState('');
  const [food, setFood] = useState('');
  const [airlines, setAirlines] = useState('');

  // Testimonial State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchPackages();
      fetchTestimonials();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'safamarwah2025' && password === 'A25EVP') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const fetchPackages = async () => {
    const querySnapshot = await getDocs(collection(db, 'packages'));
    const packagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Package[];
    setPackages(packagesData);
  };

  const fetchTestimonials = async () => {
    const querySnapshot = await getDocs(collection(db, 'testimonials'));
    const testimonialsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];
    setTestimonials(testimonialsData);
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName.trim() || !price.trim() || isNaN(Number(price))) {
      alert('Package name and a valid price are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'packages'), {
        name: packageName,
        price: Number(price),
        duration,
        description,
        departureLocation,
        distanceFromHaram,
        distanceFromMasjidENabawi,
        category,
        agentName,
        food,
        airlines,
        imageUrls: [],
      });
      fetchPackages();
      setPackageName('');
      setPrice('');
      setDuration('');
      setDescription('');
      setDepartureLocation('Hyderabad');
      setDistanceFromHaram('');
      setDistanceFromMasjidENabawi('');
      setCategory('Economy');
      setAgentName('');
      setFood('');
      setAirlines('');
    } catch (error) {
      console.error('Error adding package: ', error);
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'packages', id));
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package: ', error);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'testimonials'), {
        name,
        title,
        quote,
        avatarUrl: '', 
        avatarHint: '' 
      });
      fetchTestimonials();
      setName('');
      setTitle('');
      setQuote('');
    } catch (error) {
      console.error('Error adding testimonial: ', error);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial: ', error);
    }
  };

  const packageCategories: PackageCategory[] = ['Economy', 'Deluxe', 'Luxury', 'Family', 'Group', 'Private'];

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold mb-5">Admin Login</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Super Admin</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <AdminView />

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-5">Manage Packages</h2>
        <form onSubmit={handleAddPackage} className="space-y-4 mb-8 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Package Name" value={packageName} onChange={e => setPackageName(e.target.value)} className="p-2 border rounded" />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Departure Location" value={departureLocation} onChange={e => setDepartureLocation(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Distance from Haram" value={distanceFromHaram} onChange={e => setDistanceFromHaram(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Distance from Masjid e Nabawi" value={distanceFromMasjidENabawi} onChange={e => setDistanceFromMasjidENabawi(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Agent Name" value={agentName} onChange={e => setAgentName(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Food" value={food} onChange={e => setFood(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Airlines" value={airlines} onChange={e => setAirlines(e.target.value)} className="p-2 border rounded" />
            <select value={category} onChange={e => setCategory(e.target.value as PackageCategory)} className="p-2 border rounded">
              {packageCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Package</button>
        </form>
        <div className="space-y-2">
          {packages.map(pkg => (
            <div key={pkg.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-bold">{pkg.name}</span>
                <span className="text-sm text-gray-500 ml-2">({pkg.category})</span>
              </div>
              <button onClick={() => handleDeletePackage(pkg.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-5">Manage Testimonials</h2>
        <form onSubmit={handleAddTestimonial} className="space-y-4 mb-8 p-4 border rounded">
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          <textarea placeholder="Quote" value={quote} onChange={e => setQuote(e.target.value)} className="w-full p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Testimonial</button>
        </form>
        <div className="space-y-2">
          {testimonials.map(t => (
            <div key={t.id} className="flex items-center justify-between p-2 border rounded">
              <span>{t.name}</span>
              <button onClick={() => handleDeleteTestimonial(t.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
