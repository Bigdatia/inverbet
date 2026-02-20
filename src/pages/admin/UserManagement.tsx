
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar usuarios",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSubscriptionTier = async (userId: string, isPro: boolean) => {
    const newTier = isPro ? 'free' : 'premium'; // Toggle
    const updateData: any = { 
      subscription_tier: newTier 
    };
    
    // Si lo estamos pasando a PRO, lo marcamos activo y le ponemos fecha de inicio hoy
    if (newTier === 'premium') {
       updateData.subscription_status = 'active';
       updateData.subscription_start_date = new Date().toISOString();
    } else {
       updateData.subscription_status = 'inactive';
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map((user: any) => 
        user.id === userId ? { ...user, ...updateData } : user
      ));

      toast({
        title: "Plan actualizado",
        description: `El usuario ahora es ${newTier === 'premium' ? 'PRO' : 'FREE'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map((user: any) => 
        user.id === userId ? { ...user, is_active: newStatus } : user
      ));

      toast({
        title: "Estado actualizado",
        description: `El usuario ha sido ${newStatus ? 'activado' : 'desactivado'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Gestión de Usuarios</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Último Pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => {
              const isPro = user.subscription_tier === 'premium' || user.subscription_tier === 'pro';
              
              const lastPaymentDate = user.subscription_start_date 
                ? new Date(user.subscription_start_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A';

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-bold ${isPro ? 'text-green-500' : 'text-muted-foreground'}`}>
                         {isPro ? 'PRO' : 'FREE'}
                       </span>
                       {user.role !== 'admin' && (
                         <Switch
                           checked={isPro}
                           onCheckedChange={() => toggleSubscriptionTier(user.id, isPro)}
                         />
                       )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lastPaymentDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={() => toggleUserStatus(user.id, user.is_active)}
                      />
                      <span className={`text-sm ${user.is_active ? 'text-green-600' : 'text-red-500'}`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
