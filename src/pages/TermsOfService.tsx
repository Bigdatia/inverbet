import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 gradient-text">
            TÉRMINOS Y CONDICIONES DE SERVICIO
          </h1>
          <p className="text-muted-foreground mb-8">
            Fecha de última actualización: {currentDate}
          </p>
          
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. ACEPTACIÓN DE LOS TÉRMINOS</h2>
              <p>
                Al registrarse, acceder o utilizar la plataforma web, aplicación o servicios de INVERBET S.A.S. (en adelante "Inverbet"), usted acepta estar vinculado por estos Términos y Condiciones. Si no está de acuerdo, debe abstenerse de utilizar el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. DESCRIPCIÓN DEL SERVICIO</h2>
              <p>
                INVERBET provee herramientas tecnológicas de análisis estadístico ("Scanner"), algoritmos de detección de cuotas y contenido educativo ("Academy") relacionados con eventos deportivos. 
              </p>
              <p className="font-semibold text-primary/90 mt-2">
                ACLARACIÓN IMPORTANTE: INVERBET NO es una casa de apuestas, ni operador de juegos de suerte y azar, ni capta dinero del público con fines de inversión. INVERBET es estrictamente un proveedor de software y educación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. ADVERTENCIA DE RIESGO Y EXENCIÓN DE RESPONSABILIDAD</h2>
              <ul className="list-none space-y-4 pl-0">
                <li>
                  <strong className="text-foreground">3.1. Naturaleza Informativa:</strong> Las señales, alertas y estrategias proporcionadas por el algoritmo son meramente informativas y basadas en estadística histórica. No garantizan resultados futuros.
                </li>
                <li>
                  <strong className="text-foreground">3.2. Responsabilidad del Usuario:</strong> El usuario reconoce que las apuestas deportivas implican un riesgo alto de pérdida de capital. INVERBET no se hace responsable por pérdidas económicas, daños o perjuicios derivados del uso de nuestra información. Usted apuesta bajo su propio riesgo y responsabilidad.
                </li>
                <li>
                  <strong className="text-foreground">3.3. No Asesoría Financiera:</strong> Ningún contenido de la plataforma constituye asesoría financiera profesional bajo la legislación colombiana o internacional.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. ELEGIBILIDAD</h2>
              <p>
                El servicio está reservado exclusivamente para mayores de 18 años (o la mayoría de edad legal en su jurisdicción). Al crear una cuenta, usted declara bajo gravedad de juramento que es mayor de edad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. SUSCRIPCIONES Y PAGOS</h2>
              <ul className="list-none space-y-4 pl-0">
                <li>
                  <strong className="text-foreground">5.1. Modalidad:</strong> El servicio se ofrece bajo suscripción recurrente mensual.
                </li>
                <li>
                  <strong className="text-foreground">5.2. Pagos:</strong> Aceptamos tarjetas de crédito/débito (vía Stripe/Wompi/Paypal), PSE y Criptoactivos (USDT vía Binance Pay).
                </li>
                <li>
                  <strong className="text-foreground">5.3. Renovación Automática:</strong> Las suscripciones se renovarán automáticamente salvo que el usuario las cancele 24 horas antes del corte.
                </li>
                <li>
                  <strong className="text-foreground">5.4. Política de Reembolsos:</strong> Dado que el producto es un bien digital de consumo inmediato (acceso a información y software), <strong>NO SE OFRECEN REEMBOLSOS</strong> una vez se ha accedido a la plataforma o visualizado el contenido, salvo las excepciones de ley (fallas técnicas comprobables del servicio).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. DERECHO DE RETRACTO (LEY 1480 DE 2011 - COLOMBIA)</h2>
              <p>
                De acuerdo con el Estatuto del Consumidor, el usuario tiene derecho al retracto dentro de los 5 días hábiles siguientes a la compra.
              </p>
              <p className="mt-2">
                <strong className="text-foreground">EXCEPCIÓN:</strong> Conforme a la normativa, este derecho no aplica cuando el servicio ha comenzado a ejecutarse (ejemplo: el usuario ya ingresó al Dashboard, visualizó señales o descargó contenido educativo), al tratarse de contenido digital no suministrado en soporte material.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. PROPIEDAD INTELECTUAL</h2>
              <p>
                Todo el código fuente, algoritmos, marca comercial "INVERBET", logotipos, videos de la Academy y diseño visual ("Neo Trading") son propiedad exclusiva de LA EMPRESA. Está prohibida su reproducción, ingeniería inversa o distribución no autorizada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. LEY APLICABLE Y JURISDICCIÓN</h2>
              <p>
                Estos términos se rigen por las leyes de la República de Colombia.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
