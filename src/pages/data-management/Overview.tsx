import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { dummyData, DataItem } from '@/lib/dummy-data';
import { MoreHorizontal, Eye, CreditCard as Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DataOverview() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { header: 'ID', accessorKey: 'id' as keyof DataItem },
    { header: 'Name', accessorKey: 'name' as keyof DataItem },
    {
      header: 'Status',
      accessorKey: 'status' as keyof DataItem,
      cell: (value: DataItem['status']) => {
        const variants = {
          active: 'default',
          inactive: 'secondary',
          pending: 'outline-solid',
        } as const;
        return <Badge variant={variants[value]}>{value}</Badge>;
      },
    },
    {
      header: 'Value',
      accessorKey: 'value' as keyof DataItem,
      cell: (value: DataItem['value']) => `$${value.toLocaleString()}`,
    },
    { header: 'Created', accessorKey: 'createdAt' as keyof DataItem },
    {
      header: 'Actions',
      accessorKey: 'id' as keyof DataItem,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Overview</h1>
        <p className="text-muted-foreground">Manage and view all your data entries</p>
      </div>

      <DataTable data={dummyData} columns={columns} searchPlaceholder="Search data..." />
    </motion.div>
  );
}
