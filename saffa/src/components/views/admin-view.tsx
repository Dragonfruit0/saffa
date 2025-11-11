'use client';

import { useEffect, useState } from 'react';
import { getAnalytics, getPackageInteractions } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Interaction {
  packageName: string;
  agentName?: string;
  clickType: 'bookNow' | 'moreInfo';
  user: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }
}

export function AdminView() {
  const [analytics, setAnalytics] = useState({ logins: 0, bookNowClicks: 0 });
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData as { logins: number; bookNowClicks: number; });
      const interactionData = await getPackageInteractions();
      setInteractions(interactionData as Interaction[]);
    };

    fetchData();
  }, []);

  const interactionsByPackage = interactions.reduce((acc, interaction) => {
    const { packageName, agentName, clickType, user } = interaction;
    if (!acc[packageName]) {
      acc[packageName] = {
        agentName: agentName,
        users: []
      };
    }
    acc[packageName].users.push({ ...user, clickType });
    return acc;
  }, {} as Record<string, { agentName?: string, users: any[] }>);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.logins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>"Book Now" Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.bookNowClicks}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Package Interactions</h2>
      <div className="space-y-6">
        {Object.entries(interactionsByPackage).map(([packageName, data]) => (
          <Card key={packageName}>
            <CardHeader>
              <CardTitle>{packageName}</CardTitle>
              {data.agentName && <p className='text-sm text-gray-500'>Agent: {data.agentName}</p>}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.users.map((user, index) => (
                  <li key={index} className="p-2 border rounded-md flex justify-between items-center">
                    <div>
                      <p><strong>Name:</strong> {user.name || 'N/A'}</p>
                      <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>Click Type:</strong> {user.clickType}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
