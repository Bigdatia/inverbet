import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ScannerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: signals, isLoading, error } = useQuery({
    queryKey: ["signals-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast.error("Error al cargar señales");
        throw error;
      }
      return data;
    },
  });

  const filteredSignals = signals?.filter(signal => 
    signal.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
    signal.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Scanner</h2>
          <p className="text-muted-foreground">Administra las señales y alertas deportivas.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Señal
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-secondary/20 p-2 rounded-lg border border-border/50 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por partido o liga..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 h-auto p-0"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Hora / Fecha</TableHead>
              <TableHead>Deporte / Liga</TableHead>
              <TableHead>Partido</TableHead>
              <TableHead>Mercado / Cuota</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Cargando señales...
                </TableCell>
              </TableRow>
            ) : filteredSignals?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No hay señales registradas.
                </TableCell>
              </TableRow>
            ) : (
              filteredSignals?.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell className="font-mono text-xs">
                    {format(new Date(signal.created_at), "dd/MM HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white capitalize">{signal.sport}</span>
                      <span className="text-xs text-muted-foreground">{signal.league}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {signal.match}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-primary font-bold">{signal.market}</span>
                      <span className="text-xs font-mono">@{signal.odds}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${signal.status === 'won' ? 'bg-green-500/10 text-green-500' : 
                        signal.status === 'lost' ? 'bg-red-500/10 text-red-500' :
                        signal.status === 'void' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-blue-500/10 text-blue-500'}`}>
                      {signal.status === 'pending' ? 'Pendiente' : signal.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScannerManagement;
