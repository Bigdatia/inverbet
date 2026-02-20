
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, AlertCircle, MessageCircle } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">Gestión de Usuarios</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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
            {users
              .filter((user: any) => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                const nameMatch = user.full_name?.toLowerCase().includes(searchLower);
                const emailMatch = user.email?.toLowerCase().includes(searchLower);
                return nameMatch || emailMatch;
              })
              .map((user: any) => {
              const isPro = user.subscription_tier === 'premium' || user.subscription_tier === 'pro';
              
              const lastPaymentDate = user.subscription_start_date 
                ? new Date(user.subscription_start_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A';
                
              // Expiration logic
              let isExpiringSoon = false;
              let daysRemaining = null;
              
              if (isPro && user.subscription_end_date) {
                const endDate = new Date(user.subscription_end_date);
                const today = new Date();
                const diffTime = endDate.getTime() - today.getTime();
                daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (daysRemaining <= 3 && daysRemaining >= 0) {
                  isExpiringSoon = true;
                }
              }

              return (
                <TableRow 
                  key={user.id}
                  className={isExpiringSoon ? "bg-red-500/10 hover:bg-red-500/20" : ""}
                >
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
                    <div className="flex flex-col gap-1">
                      <span>{lastPaymentDate}</span>
                      {isExpiringSoon && (
                        <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          <span>Vence en {daysRemaining} días</span>
                        </div>
                      )}
                    </div>
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
