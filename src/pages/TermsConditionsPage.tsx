import { motion } from 'motion/react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Scale, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-accent/30">
      <PublicNavbar />
      
      <main className="pt-40">
        <section className="px-6 pb-32">
          <div className="max-w-[1000px] mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8">
                <Scale className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Service Agreement</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-tight mb-6">
                Terms & <span className="text-accent text-glow">Condition</span>
              </h1>
              <p className="text-slate-500 font-medium italic uppercase text-xs tracking-widest">
                Please read these terms carefully before using our services.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-10 md:p-16 border-white/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] opacity-20 pointer-events-none" />
                
                <div className="prose prose-invert max-w-none space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">1. Use of Services</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      By accessing or using Carlofy's services, including our portal and workshop facilities, you agree to be bound by these Terms and Conditions. Our services are intended for vehicle maintenance, diagnostics, and high-performance tuning for individuals and organizations.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">2. Booking and Cancellation</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      All service bookings are subject to availability and confirmation. We require at least 24 hours' notice for cancellations. Failure to provide adequate notice may result in a cancellation fee. We reserve the right to reschedule appointments due to technical requirements or unforeseen circumstances.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                        <AlertCircle className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">3. Limitation of Liability</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      Carlofy shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our services or the inability to use them. Our total liability for any claim arising from our services will not exceed the amount paid for the specific service in question.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight border-b border-white/5 pb-4">4. Intellectual Property</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      All content, including diagnostics reports, AI models, logos, and UI designs, are the property of Carlofy or its licensors. You are granted a limited license to access and use these materials for your personal (or authorized business) use in relation to your vehicle's maintenance.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight border-b border-white/5 pb-4">5. Governing Law</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which the service facility is located, without regard to its conflict of law principles.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
