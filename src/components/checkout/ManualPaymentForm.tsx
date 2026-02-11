import { useState } from "react";
import { Check, Loader2, DollarSign, QrCode, Download, Copy, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";

import { useTRM, formatCurrencyCOP } from "@/hooks/useTRM";

interface ManualPaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualPaymentForm = ({ isOpen, onClose }: ManualPaymentFormProps) => {
  const { data: trm } = useTRM();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    idDocument: "",
    paymentMethod: "bancolombia" as "bancolombia" | "paypal" | "binance",
  });

  // TODO: Replace with real WhatsApp number and PayPal email
  const WHATSAPP_NUMBER = "573000000000"; 
  const PAYPAL_EMAIL = "pagos@inverbet.com";
  const BINANCE_PAY_ID = "000000000"; // Placeholder
  const BINANCE_USDT_ADDRESS = "TRC20: Txxxxxxxxxxxxxxxxxxxxxx"; // Placeholder
  const AMOUNT_USD = 20;
  const priceCOP = trm ? AMOUNT_USD * trm : 0;
  
  const QR_IMAGE_PATH = "/assets/qr-bancolombia.png";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDownloadQR = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = QR_IMAGE_PATH;
    link.download = "Inverbet-QR-Bancolombia.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t.payment_form.toast_download_success);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${t.payment_form.toast_copy}`);
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.idDocument) {
      toast.error(t.payment_form.toast_fill_fields);
      setLoading(false);
      return;
    }

    try {
      let paymentMethodText = 'Bancolombia QR';
      if (formData.paymentMethod === 'paypal') paymentMethodText = 'PayPal';
      if (formData.paymentMethod === 'binance') paymentMethodText = 'Binance';

      // Construct message based on language
      let message = "";
      if (language === 'es') {
         message = `Hola Inverbet, quiero activar mi cuenta PRO.
      
Mis datos:
- Nombre: ${formData.fullName}
- ID: ${formData.idDocument}
- Email: ${formData.email}
- Método de pago: ${paymentMethodText}

Adjunto mi comprobante de pago en este chat.`;
      } else {
         message = `Hello Inverbet, I want to activate my PRO account.
      
My details:
- Name: ${formData.fullName}
- ID: ${formData.idDocument}
- Email: ${formData.email}
- Payment Method: ${paymentMethodText}

I am attaching my payment proof in this chat.`;
      }

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      toast.success(t.payment_form.toast_redirect);
      
      // Close modal after a short delay
      setTimeout(() => {  
        onClose();
        setLoading(false);
        // Reset form
        setFormData({
            fullName: "",
            email: "",
            idDocument: "",
            paymentMethod: "bancolombia",
        });
      }, 5000);

    } catch (error) {
      console.error("Error redirecting:", error);
      toast.error("Error");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-border/50 max-w-lg p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-border/30 bg-secondary/10">
          <DialogTitle className="font-display text-xl text-center">
            {t.payment_form.title}
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm mt-1">
             {t.payment_form.steps}
          </p>
        </DialogHeader>

        <form onSubmit={handleWhatsAppRedirect} className="p-6 space-y-6">
          {/* 1. Datos del Usuario */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">{t.payment_form.step1}</h3>
            <div className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="fullName">{t.payment_form.name_label} <span className="text-red-500">*</span></Label>
                <Input
                    id="fullName"
                    name="fullName"
                    placeholder={t.payment_form.input_placeholder_name}
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-secondary/30"
                />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="idDocument">{t.payment_form.id_label} <span className="text-red-500">*</span></Label>
                    <Input
                        id="idDocument"
                        name="idDocument"
                        placeholder={t.payment_form.input_placeholder_id}
                        required
                        value={formData.idDocument}
                        onChange={handleInputChange}
                        className="bg-secondary/30"
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">{t.payment_form.email_label} <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.payment_form.input_placeholder_email}
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-secondary/30"
                    />
                    </div>
                </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* 2. Método de Pago */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">{t.payment_form.step2}</h3>
            <RadioGroup
              defaultValue="bancolombia"
              onValueChange={(val: "bancolombia" | "paypal" | "binance") =>
                setFormData((prev) => ({ ...prev, paymentMethod: val }))
              }
              className="grid grid-cols-3 gap-3"
            >
              <div>
                <RadioGroupItem value="bancolombia" id="bancolombia" className="peer sr-only" />
                <Label
                  htmlFor="bancolombia"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-border/50 bg-secondary/20 p-2 hover:bg-secondary/40 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all h-full"
                >
                  <QrCode className="mb-2 h-5 w-5 text-foreground" />
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center">Bancolombia QR</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                <Label
                  htmlFor="paypal"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-border/50 bg-secondary/20 p-2 hover:bg-secondary/40 peer-data-[state=checked]:border-[#0070BA] peer-data-[state=checked]:bg-[#0070BA]/10 cursor-pointer transition-all h-full"
                >
                  <DollarSign className="mb-2 h-5 w-5 text-foreground" />
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center">PayPal</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="binance" id="binance" className="peer sr-only" />
                <Label
                  htmlFor="binance"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-border/50 bg-secondary/20 p-2 hover:bg-secondary/40 peer-data-[state=checked]:border-[#F3BA2F] peer-data-[state=checked]:bg-[#F3BA2F]/10 cursor-pointer transition-all h-full"
                >
                  <Wallet className="mb-2 h-5 w-5 text-foreground" />
                  <span className="text-[10px] sm:text-xs font-semibold text-foreground text-center">Binance</span>
                </Label>
              </div>
            </RadioGroup>

            {/* Display Payment Info */}
            <div className="mt-4 p-5 bg-black/40 rounded-lg border border-border/60 flex flex-col items-center text-center min-h-[200px] justify-center">
                {formData.paymentMethod === "bancolombia" && (
                    <div className="space-y-3 w-full animate-in fade-in duration-300">
                        <div className="bg-white p-2 rounded-lg inline-block w-48 h-48 mx-auto relative overflow-hidden group">
                            {/* Placeholder for QR Code */}
                            <img 
                                src={QR_IMAGE_PATH} 
                                alt="QR Bancolombia" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/200x200/white/black?text=QR+Bancolombia";
                                }}
                            />
                        </div>
                        
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleDownloadQR}
                            className="w-full border-primary/50 text-foreground hover:bg-primary/20 hover:text-primary"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {t.payment_form.download_qr}
                        </Button>

                        <div>
                            <p className="font-mono text-lg font-bold text-white tracking-widest">
                                {trm ? formatCurrencyCOP(priceCOP) : t.pricing.loading_trm} COP
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t.payment_form.scan_text}<br/>
                                <span className="text-primary/80">{t.payment_form.mobile_instruction}</span>
                            </p>
                        </div>
                    </div>
                )}
                
                {formData.paymentMethod === "paypal" && (
                    <div className="space-y-4 py-4 w-full animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-[#0070BA]/20 rounded-full flex items-center justify-center mx-auto text-[#0070BA]">
                            <DollarSign className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t.payment_form.send_payment_to}</p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <p className="font-mono text-lg font-bold text-white select-all">
                                  {PAYPAL_EMAIL}   
                              </p>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(PAYPAL_EMAIL, "Email PayPal")}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                        </div>
                        <div className="bg-secondary/20 p-3 rounded text-sm">
                            <span className="text-muted-foreground">{t.payment_form.amount_to_send}</span>
                            <span className="block text-xl font-bold text-white">$ {AMOUNT_USD} USD</span>
                        </div>
                        <a 
                            href={`https://paypal.me/${PAYPAL_EMAIL.split('@')[0]}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-[#0070BA] hover:underline"
                        >
                            {t.payment_form.go_to_paypal}
                        </a>
                    </div>
                )}

                {formData.paymentMethod === "binance" && (
                    <div className="space-y-4 py-4 w-full animate-in fade-in duration-300">
                        <div className="w-16 h-16 bg-[#F3BA2F]/20 rounded-full flex items-center justify-center mx-auto text-[#F3BA2F]">
                            <Wallet className="h-8 w-8" />
                        </div>
                        
                        <div>
                            <p className="text-sm text-muted-foreground">{t.payment_form.binance_id_label}</p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <p className="font-mono text-lg font-bold text-white select-all tracking-wider">
                                    {BINANCE_PAY_ID}
                                </p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(BINANCE_PAY_ID, "Binance ID")}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground my-2">{t.payment_form.or_use_address}</div>

                        <div>
                            <p className="text-sm text-muted-foreground">{t.payment_form.usdt_label}</p>
                            <div className="flex items-center justify-center gap-2 mt-1">
                                <p className="font-mono text-xs sm:text-sm font-bold text-white select-all break-all max-w-[250px]">
                                    {BINANCE_USDT_ADDRESS}
                                </p>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(BINANCE_USDT_ADDRESS, "Dirección USDT")}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-3 rounded text-sm">
                            <span className="text-muted-foreground">{t.payment_form.amount_to_send}</span>
                            <span className="block text-xl font-bold text-white">$ {AMOUNT_USD} USDT</span>
                        </div>
                    </div>
                )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* 3. Action Button */}
          <div className="pt-2">
            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(37,211,102,0.2)]"
            >
                {loading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.payment_form.loading_whatsapp}
                </>
                ) : (
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t.payment_form.btn_whatsapp}
                </div>
                )}
            </Button>
            <p className="text-center text-muted-foreground text-xs mt-3">
                {t.payment_form.whatsapp_note}
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualPaymentForm;
