
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 gradient-text">
            POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS - HABEAS DATA
          </h1>
          
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-8">
            <p className="text-foreground italic">
              En cumplimiento de la Ley 1581 de 2012, damos estricto cumplimiento a la protección de datos personales.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. RESPONSABLE DEL TRATAMIENTO</h2>
              <ul className="list-none space-y-2 pl-0">
                <li><strong className="text-foreground">Razón Social:</strong> INVERBET S.A.S.</li>
                <li><strong className="text-foreground">Domicilio:</strong> Bucaramanga, Colombia.</li>
                <li><strong className="text-foreground">Correo de contacto:</strong> legal@inverbet.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. DATOS QUE RECOLECTAMOS</h2>
              <p className="mb-4">Para la prestación del servicio, recolectamos:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Datos de Identificación:</strong> Nombre, Correo electrónico, País de residencia.
                </li>
                <li>
                  <strong className="text-foreground">Datos Transaccionales:</strong> Historial de suscripciones (NO almacenamos números completos de tarjetas de crédito; estos son procesados por pasarelas seguras como Stripe/Wompi).
                </li>
                <li>
                  <strong className="text-foreground">Datos de Uso:</strong> Interacción con el Scanner, preferencias de ligas y progreso en la Academy.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. FINALIDAD DEL TRATAMIENTO</h2>
              <p className="mb-4">Los datos se usarán para:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>a) Proveer acceso a la plataforma y autenticación de usuarios.</li>
                <li>b) Procesar pagos y facturación.</li>
                <li>c) Enviar notificaciones de señales (si el usuario las activa).</li>
                <li>d) Enviar información sobre actualizaciones o nuevos productos (Marketing), siempre que haya autorización.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. DERECHOS DEL TITULAR (ARCO)</h2>
              <p className="mb-4">Conforme a la ley colombiana, usted tiene derecho a:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Conocer:</strong> Qué datos tenemos de usted.</li>
                <li><strong className="text-foreground">Actualizar:</strong> Rectificar datos erróneos.</li>
                <li><strong className="text-foreground">Rectificar:</strong> Corregir información.</li>
                <li><strong className="text-foreground">Suprimir:</strong> Solicitar la eliminación de sus datos cuando no sean necesarios para la prestación del servicio contratado.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. TRANSFERENCIA INTERNACIONAL DE DATOS</h2>
              <p>
                El usuario acepta que sus datos pueden ser procesados en servidores ubicados fuera de Colombia (ej. Estados Unidos), necesarios para la infraestructura tecnológica. INVERBET garantiza que dichos proveedores cumplen con estándares de seguridad de la industria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. SEGURIDAD DE LA INFORMACIÓN</h2>
              <p>
                Implementamos protocolos de seguridad (SSL/TLS, encriptación de contraseñas) para proteger sus datos. Sin embargo, ninguna transmisión por internet es 100% segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. USO DE COOKIES</h2>
              <p>
                Utilizamos cookies propias y de terceros para mantener la sesión del usuario activa y analizar el rendimiento de la plataforma.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
