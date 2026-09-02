'use client';

import { useEffect, useState } from 'react';
import { AppShell, DemoBanner, LoadingSpinner, EmptyState } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { actionGetGrievances, actionLogin, actionResolveGrievance } from '@/actions/agri-actions';
import type { Grievance } from '@/lib/types';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AdminGrievancesPage() {
  const [loading, setLoading] = useState(true);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);

  async function loadData() {
    await actionLogin('admin');
    const data = await actionGetGrievances();
    setGrievances(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleResolve(id: string) {
    setActionId(id);
    try {
      await actionResolveGrievance(id);
      await loadData();
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return (
      <AppShell role="admin" userName="AgriLink Admin">
        <LoadingSpinner />
      </AppShell>
    );
  }

  return (
    <AppShell role="admin" userName="AgriLink Admin Center">
      <DemoBanner />

      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="h-7 w-7 text-amber-600" />
              Farmer Grievance & Dispute Center
            </h1>
            <p className="text-gray-500 mt-1">
              Monitor, review, and resolve reported payment or delivery disputes
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Grievance Tickets ({grievances.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {grievances.length === 0 ? (
              <EmptyState title="No active grievances" description="All farmer transactions and payments are running smoothly." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3">Farmer</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {grievances.map((g) => (
                      <tr key={g.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-900">{g.id}</td>
                        <td className="px-4 py-3 font-medium">{g.farmerName}</td>
                        <td className="px-4 py-3">
                          <Badge variant="warning">{g.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{g.description}</td>
                        <td className="px-4 py-3">
                          <Badge variant={g.status === 'RESOLVED' ? 'success' : g.status === 'IN_REVIEW' ? 'info' : 'danger'}>
                            {g.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {g.status !== 'RESOLVED' ? (
                            <Button
                              size="sm"
                              onClick={() => handleResolve(g.id)}
                              disabled={actionId === g.id}
                              className="bg-emerald-700 hover:bg-emerald-800"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              {actionId === g.id ? "Resolving..." : "Mark Resolved"}
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
