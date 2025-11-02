
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Package, Testimonial } from '@/lib/types';

export default function AdminPage() {
  // Package State
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [airline, setAirline] = useState('');
  const [departureLocation, setDepartureLocation] = useState('');
  const [food, setFood] = useState('');
  const [distanceFromHaram, setDistanceFromHaram] = useState('');

  // Testimonial State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    fetchPackages();
    fetchTestimonials();
  }, []);

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
    try {
      await addDoc(collection(db, 'packages'), {
        packageName,
        price: Number(price),
        duration,
        airline,
        departureLocation,
        food,
        distanceFromHaram,
        ziyaratGuide: false, // Default value
        imageUrl: '', // Default value
        imageHint: '' // Default value
      });
      fetchPackages();
      // Clear form
      setPackageName('');
      setPrice('');
      setDuration('');
      setAirline('');
      setDepartureLocation('');
      setFood('');
      setDistanceFromHaram('');
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
        avatarUrl: '', // Default value
        avatarHint: '' // Default value
      });
      fetchTestimonials();
      // Clear form
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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-10">Super Admin</h1>

      {/* Manage Packages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-5">Manage Packages</h2>
        <form onSubmit={handleAddPackage} className="space-y-4 mb-8 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Package Name" value={packageName} onChange={e => setPackageName(e.target.value)} className="p-2 border rounded" />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Airline" value={airline} onChange={e => setAirline(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Departure Location" value={departureLocation} onChange={e => setDepartureLocation(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Food" value={food} onChange={e => setFood(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Distance from Haram" value={distanceFromHaram} onChange={e => setDistanceFromHaram(e.target.value)} className="p-2 border rounded" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Package</button>
        </form>
        <div className="space-y-2">
          {packages.map(pkg => (
            <div key={pkg.id} className="flex items-center justify-between p-2 border rounded">
              <span>{pkg.packageName}</span>
              <button onClick={() => handleDeletePackage(pkg.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Manage Testimonials */}
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
