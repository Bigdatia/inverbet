
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
import { useToast } from "@/hooks/use-toast";
import { Check, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      toast({
        title: t.dashboard.admin.registrations.error_load,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected', email: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      if (newStatus === 'approved') {
        toast({
          title: t.dashboard.admin.registrations.approved_title,
          description: t.dashboard.admin.registrations.approved_desc.replace('{email}', email),
        });
      }

      setRegistrations(registrations.map((reg: any) => 
        reg.id === id ? { ...reg, status: newStatus } : reg
      ));

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
      <h1 className="text-3xl font-display font-bold">{t.dashboard.admin.registrations.title}</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.dashboard.admin.registrations.cols.date}</TableHead>
              <TableHead>{t.dashboard.admin.registrations.cols.name}</TableHead>
              <TableHead>{t.dashboard.admin.registrations.cols.email}</TableHead>
              <TableHead>{t.dashboard.admin.registrations.cols.method}</TableHead>
              <TableHead>{t.dashboard.admin.registrations.cols.proof}</TableHead>
              <TableHead>{t.dashboard.admin.registrations.cols.status}</TableHead>
              <TableHead>{t.dashboard.admin.registrations.cols.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg: any) => (
              <TableRow key={reg.id}>
                <TableCell>{new Date(reg.created_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}</TableCell>
                <TableCell>{reg.full_name}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell className="capitalize">{reg.payment_method}</TableCell>
                <TableCell>
                  {reg.payment_proof_url && (
                    <a 
                      href={reg.payment_proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      {t.dashboard.admin.registrations.view} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                    reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reg.status}
                  </span>
                </TableCell>
                <TableCell>
                  {reg.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(reg.id, 'approved', reg.email)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(reg.id, 'rejected', reg.email)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Registrations;
