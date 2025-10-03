import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { dummyAdmins, Admin } from '@/lib/dummy-data';
import { MoreHorizontal, Eye, CreditCard as Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminsTable() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { header: 'Name', accessorKey: 'name' as keyof Admin },
    {
      header: 'Permissions',
      accessorKey: 'permissions' as keyof Admin,
      cell: (value: Admin['permissions']) => (
        <div className="flex gap-1 flex-wrap">
          {value.map((perm) => (
            <Badge key={perm} variant="outline" className="text-xs">
              {perm}
            </Badge>
          ))}
        </div>
      ),
    },
    { header: 'Last Login', accessorKey: 'lastLogin' as keyof Admin },
    {
      header: 'Actions',
      accessorKey: 'id' as keyof Admin,
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
              Edit Permissions
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Remove Admin
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
        <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
        <p className="text-muted-foreground">Manage administrative users and their permissions</p>
      </div>

      <DataTable data={dummyAdmins} columns={columns} searchPlaceholder="Search admins..." />
    </motion.div>
  );
}
