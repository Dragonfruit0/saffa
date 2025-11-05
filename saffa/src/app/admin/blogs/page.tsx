'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Blog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function BlogManagement() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      const fetchBlogs = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'blogs'));
          const blogsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toLocaleDateString() ?? null
          })) as Blog[];
          setBlogs(blogsData);
        } catch (error) {
          console.error("Error fetching blogs:", error);
          toast({ title: 'Error', description: 'Failed to fetch blogs.', variant: 'destructive' });
        }
      };

      fetchBlogs();
    }
  }, [isLoggedIn, toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'safamarwah2025' && password === 'A25EVP') {
      setIsLoggedIn(true);
    } else {
      toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBlog = async () => {
    if (!isLoggedIn) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to create a blog post.', variant: 'destructive' });
      return;
    }
    if (!newBlog.title || !newBlog.content || !newBlog.author) {
      toast({ title: 'Error', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    try {
      const blogData = { ...newBlog, createdAt: serverTimestamp() };
      const docRef = await addDoc(collection(db, 'blogs'), blogData);
      const newBlogWithDate = {
        ...newBlog,
        id: docRef.id,
        createdAt: new Date().toLocaleDateString()
      };
      setBlogs(prev => [...prev, newBlogWithDate]);
      setNewBlog({ title: '', content: '', author: '' });
      toast({ title: 'Success', description: 'Blog post added successfully.' });
    } catch (error) {
      console.error("Error adding blog:", error);
      toast({ title: 'Error', description: 'Failed to add blog post.', variant: 'destructive' });
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!isLoggedIn) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to delete a blog post.', variant: 'destructive' });
      return;
    }
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      toast({ title: 'Success', description: 'Blog post deleted successfully.' });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({ title: 'Error', description: 'Failed to delete blog post.', variant: 'destructive' });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleLogin} className="p-10 bg-white rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-5 text-center">Admin Login for Blogs</h2>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">Login</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Blog Management</h1>
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input name="title" placeholder="Title" value={newBlog.title} onChange={handleInputChange} />
            <Input name="author" placeholder="Author" value={newBlog.author} onChange={handleInputChange} />
            <Textarea name="content" placeholder="Content" value={newBlog.content} onChange={handleInputChange} />
            <Button onClick={handleAddBlog}>Add Blog</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-3xl font-bold mb-4">Existing Blogs</h2>
        <div className="space-y-4">
          {blogs.map(blog => (
            <Card key={blog.id}>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">By {blog.author} on {blog.createdAt}</p>
                <p className="mt-4">{blog.content}</p>
                <Button variant="destructive" className="mt-4" onClick={() => handleDeleteBlog(blog.id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
