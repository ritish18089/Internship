import { motion } from 'motion/react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage = () => {
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
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Legal & Compliance</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-tight mb-6">
                Privacy <span className="text-accent text-glow">Policy</span>
              </h1>
              <p className="text-slate-500 font-medium italic uppercase text-xs tracking-widest">
                Last updated: October 2023. Our commitment to your data security.
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
                        <Lock className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">1. Information Collection</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      At Carlofy, we collect information that you provide directly to us when you create an account, book a service, or communicate with us. This may include your name, email address, phone number, vehicle identification number (VIN), and service history. We also automatically collect certain technical information when you visit our site, such as your IP address and browser type.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                        <Eye className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">2. How We Use Your Information</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      We use the information we collect to provide, maintain, and improve our services. This includes processing your bookings, sending you service reminders, diagnosing vehicle issues through our AI-driven systems, and communicating with you about technical updates, security alerts, and support messages.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">3. Data Sharing and Disclosure</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      We do not sell your personal information. We may share your data with third-party service providers who perform services on our behalf (such as payment processing or parts sourcing), as required by law, or to protect the rights and safety of Carlofy and our users.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight border-b border-white/5 pb-4">4. Security</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      We implement industry-standard security measures designed to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight border-b border-white/5 pb-4">5. Your Choices</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                      You may access, update, or delete your account information at any time by logging into your account settings. You can also opt-out of receiving promotional communications from us by following the instructions in those messages.
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
