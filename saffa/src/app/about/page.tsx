'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Blog } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() ?? null
      })) as Blog[];
      setBlogs(blogsData);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-bold mb-4">About SafaMarwah</h1>
        <p className="text-lg text-muted-foreground mb-8">
          SafaMarwah is a platform dedicated to providing a seamless and enriching experience for pilgrims on their sacred journey of Umrah and Hajj. We are committed to offering the best packages and services to ensure a memorable and spiritually fulfilling pilgrimage.
        </p>

        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Our mission is to simplify the process of planning and booking for Umrah and Hajj. We aim to provide transparency, convenience, and exceptional customer service to our users. We believe that every pilgrim deserves a hassle-free and memorable journey, and we are here to make that a reality.
        </p>

        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
        <p className="text-lg text-muted-foreground mb-8">
          SafaMarwah was founded with the vision of creating a one-stop platform for all pilgrimage needs. Our team is passionate about travel and technology, and we are dedicated to leveraging innovation to enhance the pilgrimage experience.
        </p>
        
        <h2 className="text-3xl font-bold mb-4">Useful Links</h2>
        <ul className="list-disc list-inside text-lg text-muted-foreground mb-8">
            <li><a href="https://en.wikipedia.org/wiki/Umrah" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more about Umrah</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Hajj" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more about Hajj</a></li>
        </ul>

        <h2 className="text-3xl font-bold mb-4">Blogs</h2>
        <div className="space-y-4">
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <Card key={blog.id}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">By {blog.author} on {blog.createdAt}</p>
                  <p className="mt-4 whitespace-pre-wrap">{blog.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-lg text-muted-foreground">No blog posts yet. Stay tuned!</p>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
