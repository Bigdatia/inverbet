import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Trash2, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, startOfDay, isBefore, isToday, isTomorrow, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/LanguageContext";

const ScannerManagement = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sport: "futbol",
    league: "",
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    type: "prematch",
    market: "",
    odds: "",
    stake: "85",
    confidence: "high",
    status: "pending",
    analysis: "",
    is_premium: true
  });

  const { data: signals, isLoading } = useQuery({
    queryKey: ["signals-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast.error(t.dashboard.admin.scanner.error_load);
        throw error;
      }
      return data;
    },
  });

  const createSignalMutation = useMutation({
    mutationFn: async (newSignal: any) => {
      const { error } = await supabase.from("signals").insert([newSignal]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.dashboard.admin.scanner.signal_created);
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["signals-admin"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t.dashboard.admin.scanner.error_create);
    }
  });

  const updateSignalMutation = useMutation({
    mutationFn: async (updatedSignal: any) => {
      const { error } = await supabase
        .from("signals")
        .update(updatedSignal)
        .eq("id", editingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.dashboard.admin.scanner.signal_updated);
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["signals-admin"] });
      queryClient.invalidateQueries({ queryKey: ["signals"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(t.dashboard.admin.scanner.error_update);
    }
  });

  const deleteSignalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("signals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.dashboard.admin.scanner.signal_deleted);
      queryClient.invalidateQueries({ queryKey: ["signals-admin"] });
      queryClient.invalidateQueries({ queryKey: ["signals"] });
    },
    onError: (error) => {
      toast.error(t.dashboard.admin.scanner.error_delete);
    }
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      sport: "futbol",
      league: "",
      teamA: "",
      teamB: "",
      date: "",
      time: "",
      type: "prematch",
      market: "",
      odds: "",
      stake: "85",
      confidence: "high",
      status: "pending",
      analysis: "",
      is_premium: true
    });
  };

  const handleEdit = (signal: any) => {
    const teams = signal.match ? signal.match.split(/\s+v\.?s\.?\s+/i) : ["", ""];
    const teamA = teams[0] || signal.match || "";
    const teamB = teams.length > 1 ? teams[1] : "";
    
    const dateObj = new Date(signal.created_at);
    const dateStr = format(dateObj, "yyyy-MM-dd");
    const timeStr = format(dateObj, "HH:mm");

    setEditingId(signal.id);
    setFormData({
      sport: signal.sport,
      league: signal.league,
      teamA: teamA,
      teamB: teamB,
      date: dateStr,
      time: timeStr,
      type: signal.type,
      market: signal.market,
      odds: signal.odds.toString(),
      stake: signal.stake.toString(),
      confidence: signal.confidence || "high",
      status: signal.status || "pending",
      analysis: signal.analysis || "",
      is_premium: true
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t.dashboard.admin.scanner.confirm_delete)) {
      deleteSignalMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamA || !formData.teamB || !formData.market || !formData.odds) {
      toast.error(t.dashboard.admin.scanner.required_fields);
      return;
    }

    const matchDate = formData.date && formData.time 
      ? new Date(`${formData.date}T${formData.time}`).toISOString() 
      : new Date().toISOString();

    const signalData = {
      sport: formData.sport,
      league: formData.league,
      match: `${formData.teamA} vs ${formData.teamB}`,
      type: formData.type,
      market: formData.market,
      odds: parseFloat(formData.odds),
      stake: parseInt(formData.stake),
      confidence: formData.confidence,
      status: formData.status,
      analysis: formData.analysis,
      is_premium: true,
      created_at: matchDate,
    };

    if (editingId) {
      updateSignalMutation.mutate(signalData);
    } else {
      createSignalMutation.mutate(signalData);
    }
  };

  const filteredSignals = signals?.filter(signal => {
    const matchesSearch = signal.match.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          signal.league.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!showOnlyUpcoming) return matchesSearch;
    
    const isPast = isBefore(new Date(signal.created_at), startOfDay(new Date()));
    return matchesSearch && !isPast;
  })?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const groupedSignals = filteredSignals?.reduce((groups, signal) => {
    const date = format(new Date(signal.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(signal);
    return groups;
  }, {} as Record<string, typeof signals>);

  const dateLocale = language === 'es' ? es : enUS;

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return t.dashboard.admin.scanner.today_label;
    if (isTomorrow(date)) return t.dashboard.admin.scanner.tomorrow_label;
    return format(date, language === 'es' ? "EEEE, d 'de' MMMM" : "EEEE, MMMM d", { locale: dateLocale }).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{t.dashboard.admin.scanner.title}</h2>
          <p className="text-muted-foreground">{t.dashboard.admin.scanner.subtitle}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={async () => {
                try {
                  toast.loading(t.dashboard.admin.scanner.importing);
                  const historicalSignals = [
                    // 11 Feb
                    { match: "Man. City vs. Fulham", date: "2024-02-11T12:00:00Z", market: "Over 0.5 Goles 1T", odds: 1.33, status: "won" },
                    { match: "Aston Villa vs. Brighton", date: "2024-02-11T12:05:00Z", market: "Over 1.5 Goles Totales", odds: 1.25, status: "lost" },
                    { match: "Bayern vs. RB Leipzig", date: "2024-02-11T12:10:00Z", market: "Ambos Equipos Anotan", odds: 1.57, status: "lost" },
                    { match: "Sunderland vs. Liverpool", date: "2024-02-11T12:15:00Z", market: "Over 0.5 Goles 1T", odds: 1.30, status: "lost" },
                    { match: "Sunderland vs. Liverpool", date: "2024-02-11T12:20:00Z", market: "Más de 7.5 Córners", odds: 1.40, status: "won" },
                    { match: "Inter Bogotá vs. Cali", date: "2024-02-11T12:25:00Z", market: "Over 1.5 Goles Totales", odds: 1.45, status: "won" },
                    
                    // 12 Feb
                    { match: "Thun vs. Lausanne", date: "2024-02-12T12:00:00Z", market: "Ambos Equipos Anotan", odds: 1.62, status: "won" },
                    { match: "Atleti vs. Barcelona", date: "2024-02-12T12:05:00Z", market: "Over 0.5 Goles 1T", odds: 1.36, status: "won" },
                    { match: "Brentford vs. Arsenal", date: "2024-02-12T12:10:00Z", market: "Over 1.5 Goles Totales", odds: 1.22, status: "won" },
                    { match: "Once Caldas vs. Junior", date: "2024-02-12T12:15:00Z", market: "Over 1.5 Goles Totales", odds: 1.50, status: "won" },
                    { match: "Nacional vs. Fortaleza", date: "2024-02-12T12:20:00Z", market: "Over 0.5 Goles 1T", odds: 1.38, status: "won" },

                    // 13 Feb
                    { match: "Dortmund vs. Mainz", date: "2024-02-13T12:00:00Z", market: "Over 0.5 Goles 1T", odds: 1.28, status: "won" },
                    { match: "Hull vs. Chelsea", date: "2024-02-13T12:05:00Z", market: "Gana Chelsea (ML)", odds: 1.53, status: "won" },
                    { match: "Al-Ittihad vs. Al Fayha", date: "2024-02-13T12:10:00Z", market: "Over 1.5 Goles Totales", odds: 1.25, status: "won" },
                    { match: "Pisa vs. AC Milan", date: "2024-02-13T12:15:00Z", market: "Más de 7.5 Córners", odds: 1.44, status: "lost" },
                    { match: "América vs. Santa Fe", date: "2024-02-13T12:20:00Z", market: "Over 1.5 Goles Totales", odds: 1.48, status: "lost" },

                    // 14 Feb
                    { match: "Leverkusen vs. St. Pauli", date: "2024-02-14T12:00:00Z", market: "Over 1.5 Goles Totales", odds: 1.20, status: "won" },
                    { match: "Hoffenheim vs. Friburgo", date: "2024-02-14T12:05:00Z", market: "Over 0.5 Goles 1T", odds: 1.33, status: "lost" },
                    { match: "Bremen vs. Bayern", date: "2024-02-14T12:10:00Z", market: "Over 2.5 Goles Totales", odds: 1.40, status: "won" },
                    { match: "Marsella vs. Estrasburgo", date: "2024-02-14T12:15:00Z", market: "Over 1.5 Goles Totales", odds: 1.28, status: "won" },
                    { match: "St. Gallen vs. Grasshoppers", date: "2024-02-14T12:20:00Z", market: "Over 1.5 Goles Totales", odds: 1.22, status: "lost" },
                    { match: "Zúrich vs. Lucerna", date: "2024-02-14T12:25:00Z", market: "Over 0.5 Goles 1T", odds: 1.36, status: "won" },
                    { match: "Inter vs. Juventus", date: "2024-02-14T12:30:00Z", market: "Más de 7.5 Córners", odds: 1.40, status: "won" },
                    { match: "Real Madrid vs. R. Sociedad", date: "2024-02-14T12:35:00Z", market: "Gana Real Madrid (ML)", odds: 1.57, status: "won" },
                    { match: "Liverpool vs. Brighton", date: "2024-02-14T12:40:00Z", market: "Over 0.5 Goles 1T", odds: 1.30, status: "won" },
                    { match: "Medellín vs. Pereira", date: "2024-02-14T12:45:00Z", market: "Over 1.5 Goles Totales", odds: 1.45, status: "won" },

                    // 15 Feb
                    { match: "Udinese vs. Sassuolo", date: "2024-02-15T12:00:00Z", market: "Over 0.5 Goles 1T", odds: 1.40, status: "won" },
                    { match: "Cercle vs. Club Brujas", date: "2024-02-15T12:05:00Z", market: "Over 1.5 Goles Totales", odds: 1.25, status: "won" },
                    { match: "Thun vs. Sion", date: "2024-02-15T12:10:00Z", market: "Over 1.5 Goles Totales", odds: 1.22, status: "won" },
                    { match: "Oxford Utd vs. Sunderland", date: "2024-02-15T12:15:00Z", market: "Over 0.5 Goles 1T", odds: 1.44, status: "won" },
                    { match: "Stoke vs. Fulham", date: "2024-02-15T12:20:00Z", market: "Over 0.5 Goles 1T", odds: 1.44, status: "won" },
                    { match: "Rayo vs. Atleti", date: "2024-02-15T12:25:00Z", market: "Over 1.5 Goles Totales", odds: 1.33, status: "won" },
                    { match: "Leipzig vs. Wolfsburgo", date: "2024-02-15T12:30:00Z", market: "Over 0.5 Goles 1T", odds: 1.30, status: "won" },
                    { match: "Cali vs. Nacional", date: "2024-02-15T12:35:00Z", market: "Doble Op. (Cali o Empate)", odds: 1.62, status: "won" }
                  ];

                  for (const signal of historicalSignals) {
                    const payload = {
                      sport: "futbol",
                      league: "Histórico",
                      match: signal.match,
                      type: "prematch",
                      market: signal.market,
                      odds: signal.odds,
                      stake: 85,
                      confidence: "high", 
                      status: signal.status,
                      analysis: "Importado de Excel",
                      is_premium: true,
                      created_at: signal.date,
                    };
                    await supabase.from("signals").insert([payload]);
                  }
                  toast.dismiss();
                  toast.success(t.dashboard.admin.scanner.import_success);
                  queryClient.invalidateQueries({ queryKey: ["signals-admin"] });
                } catch(e) {
                  toast.dismiss();
                  toast.error(t.dashboard.admin.scanner.import_error);
                }
              }}
            >
              {t.dashboard.admin.scanner.load_history}
            </Button>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-black font-bold" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                {t.dashboard.admin.scanner.new_signal}
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle>{editingId ? t.dashboard.admin.scanner.edit_signal : t.dashboard.admin.scanner.create_signal}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.league}</Label>
                  <Input 
                    placeholder={t.dashboard.admin.scanner.form.league_placeholder}
                    value={formData.league}
                    onChange={(e) => setFormData({...formData, league: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.team_a}</Label>
                  <Input 
                    placeholder={t.dashboard.admin.scanner.form.team_a_placeholder}
                    value={formData.teamA}
                    onChange={(e) => setFormData({...formData, teamA: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.team_b}</Label>
                  <Input 
                    placeholder={t.dashboard.admin.scanner.form.team_b_placeholder}
                    value={formData.teamB}
                    onChange={(e) => setFormData({...formData, teamB: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.match_date}</Label>
                  <Input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.time}</Label>
                  <Input 
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>{t.dashboard.admin.scanner.form.market}</Label>
                  <Input 
                    placeholder={t.dashboard.admin.scanner.form.market_placeholder}
                    value={formData.market}
                    onChange={(e) => setFormData({...formData, market: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.odds}</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="1.85"
                    value={formData.odds}
                    onChange={(e) => {
                      const newOddsStr = e.target.value;
                      const newOdds = parseFloat(newOddsStr);
                      let newProbStr = formData.stake;
                      let newConfidence = formData.confidence;

                      if (!isNaN(newOdds) && newOdds > 1) {
                        const calculatedProb = Math.round(100 / newOdds);
                        newProbStr = calculatedProb.toString();
                        newConfidence = calculatedProb >= 80 ? "high" : "medium";
                      }

                      setFormData({
                        ...formData, 
                        odds: newOddsStr,
                        stake: newProbStr,
                        confidence: newConfidence
                      });
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.type}</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(val) => setFormData({...formData, type: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prematch">{t.dashboard.admin.scanner.form.prematch}</SelectItem>
                      <SelectItem value="live">{t.dashboard.admin.scanner.form.live}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.probability}</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    value={formData.stake}
                    disabled
                    className="bg-muted"
                  />
                </div>
                 <div className="space-y-2">
                  <Label>{t.dashboard.admin.scanner.form.confidence_auto}</Label>
                  <Select 
                    value={formData.confidence}
                    disabled
                  >
                    <SelectTrigger className="bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t.dashboard.admin.scanner.form.confidence_low}</SelectItem>
                      <SelectItem value="medium">{t.dashboard.admin.scanner.form.confidence_medium}</SelectItem>
                      <SelectItem value="high">{t.dashboard.admin.scanner.form.confidence_high}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label>{t.dashboard.admin.scanner.form.status_label}</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({...formData, status: val})}
                >
                  <SelectTrigger className={
                    formData.status === 'won' ? 'text-green-500 font-bold border-green-500/50 bg-green-500/10' :
                    formData.status === 'lost' ? 'text-red-500 font-bold border-red-500/50 bg-red-500/10' :
                    formData.status === 'void' ? 'text-yellow-500 font-bold border-yellow-500/50 bg-yellow-500/10' :
                    ''
                  }>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t.dashboard.admin.scanner.form.status_pending}</SelectItem>
                    <SelectItem value="won">{t.dashboard.admin.scanner.form.status_won}</SelectItem>
                    <SelectItem value="lost">{t.dashboard.admin.scanner.form.status_lost}</SelectItem>
                    <SelectItem value="void">{t.dashboard.admin.scanner.form.status_void}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.dashboard.admin.scanner.form.analysis}</Label>
                <Textarea 
                  placeholder={t.dashboard.admin.scanner.form.analysis_placeholder}
                  value={formData.analysis}
                  onChange={(e) => setFormData({...formData, analysis: e.target.value})}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-black font-bold mt-4" disabled={createSignalMutation.isPending || updateSignalMutation.isPending}>
                {(createSignalMutation.isPending || updateSignalMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? t.dashboard.admin.scanner.update_btn : t.dashboard.admin.scanner.publish_btn}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-secondary/20 p-2 rounded-lg border border-border/50 w-full sm:max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t.dashboard.admin.scanner.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none bg-transparent focus-visible:ring-0 h-auto p-0"
          />
        </div>
        
        <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-lg border border-border/50">
          <Switch 
            checked={showOnlyUpcoming} 
            onCheckedChange={setShowOnlyUpcoming} 
            id="filter-past"
          />
          <Label htmlFor="filter-past" className="text-sm cursor-pointer mb-0">
            {t.dashboard.admin.scanner.hide_past}
          </Label>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>{t.dashboard.admin.scanner.cols.time_date}</TableHead>
              <TableHead>{t.dashboard.admin.scanner.cols.sport_league}</TableHead>
              <TableHead>{t.dashboard.admin.scanner.cols.match}</TableHead>
              <TableHead>{t.dashboard.admin.scanner.cols.market_odds}</TableHead>
              <TableHead>{t.dashboard.admin.scanner.cols.prob_conf_status}</TableHead>
              <TableHead className="text-right">{t.dashboard.admin.scanner.cols.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t.dashboard.admin.scanner.loading}
                </TableCell>
              </TableRow>
            ) : filteredSignals?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {t.dashboard.admin.scanner.no_signals}
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedSignals || {}).map(([dateStr, daySignals]) => (
                <React.Fragment key={dateStr}>
                  {/* Date Header Row */}
                  <TableRow className="bg-primary/10 hover:bg-primary/10 border-y border-primary/20">
                    <TableCell colSpan={6} className="py-2 text-primary font-bold text-sm tracking-wider">
                      {getDateLabel(dateStr)}
                    </TableCell>
                  </TableRow>
                  
                  {/* Signals for this day */}
                  {daySignals.map((signal) => (
                    <TableRow key={signal.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                      <TableCell className="font-mono text-sm text-white font-medium">
                        {format(new Date(signal.created_at), "HH:mm")}
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
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded
                              ${signal.confidence === 'high' ? 'bg-primary/20 text-primary' : 
                                signal.confidence === 'low' ? 'bg-red-500/20 text-red-500' : 
                                'bg-yellow-500/20 text-yellow-500'}`}>
                              {signal.confidence === 'high' ? t.dashboard.admin.scanner.form.confidence_high : signal.confidence === 'low' ? t.dashboard.admin.scanner.form.confidence_low : t.dashboard.admin.scanner.form.confidence_medium}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">{t.dashboard.admin.scanner.prob_label} {signal.stake}%</span>
                          </div>
                          <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                            ${signal.status === 'won' ? 'bg-green-500/10 text-green-500' : 
                              signal.status === 'lost' ? 'bg-red-500/10 text-red-500' :
                              signal.status === 'void' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-blue-500/10 text-blue-500'}`}>
                            {signal.status === 'pending' ? t.dashboard.admin.scanner.status_pending : signal.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" onClick={() => handleEdit(signal)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(signal.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScannerManagement;
