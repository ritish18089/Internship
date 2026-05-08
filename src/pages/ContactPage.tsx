import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Clock, 
  ChevronRight,
  ArrowRight,
  Send,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export const ContactPage = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      await api.post('/contact', formData);
      setFormStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact submission failed:', error);
      setFormStatus('idle');
      alert('Failed to send inquiry. Please try again later.');
    }
  };
  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-accent/30">
      <PublicNavbar />
      
      <main className="pt-40">
        {/* Header Section */}
        <section className="px-6 pb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-tight mb-8">
              Let's <span className="text-accent text-glow-accent">Connect</span> <br />
              <span className="text-gradient">Precision Service.</span>
            </h1>

            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl mx-auto italic uppercase text-xs tracking-[0.4em] mb-20 opacity-60">
              Immediate Response For Performance Requests.
            </p>
          </motion.div>
        </section>

        {/* Info Grid */}
        <section className="px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32 relative z-10">
          {[
            { 
              title: "WhatsApp Us", 
              desc: "Instant performance support and consultations.", 
              value: "9019854584", 
              icon: Phone, 
              action: "Message Now", 
              href: "https://wa.me/message/VO7NPNOOEGEWD1" 
            },
            { 
              title: "Email Us", 
              desc: "For general inquiries, quotes, and corporate requests.", 
              value: "ritish1808@gmail.com", 
              icon: Mail, 
              action: "Send Email", 
              href: "mailto:ritish1808@gmail.com" 
            },
            { 
              title: "Global HQ", 
              desc: "State-of-the-art facility for diagnostics and repair.", 
              value: "Talaghattapura", 
              icon: MapPin, 
              action: "Get Directions", 
              href: "https://maps.app.goo.gl/ijopKg57KUg3iKEP8" 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-12 group glass-card-hover flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-10 group-hover:bg-accent transition-all ring-1 ring-white/10 ring-inset shadow-[0_0_20px_rgba(217,255,63,0.2)]">
                <item.icon className="w-10 h-10 text-accent group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-[0.3em] mb-4 group-hover:text-accent transition-colors">{item.title}</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 max-w-[200px] leading-relaxed">{item.desc}</p>
              <p className="text-2xl font-black text-white italic tracking-tighter mb-10 text-glow-accent">{item.value}</p>
              <a href={item.href} className="flex items-center space-x-2 text-[10px] font-black text-accent uppercase tracking-[0.25em] hover:underline italic group/link">
                <span>{item.action}</span>
                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </motion.div>

          ))}
        </section>

        {/* Main Content: Form and Info */}
        <section className="px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tight mb-8">Performance <span className="text-accent underline decoration-accent/20 underline-offset-8 decoration-4">Assurance.</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                Our advisors are standing by 24/7 for premium members. For standard inquiries, please allow 2-4 business hours for a detailed performance response.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-8 p-8 glass-card border-none bg-white/[0.02] hover:bg-white/[0.04]">
                <Globe className="w-12 h-12 text-accent opacity-40 shrink-0" />
                <div>
                   <h4 className="text-lg font-black text-white italic uppercase mb-1">Global Network</h4>
                   <p className="text-slate-500 text-sm font-medium">15+ partner facilities nationwide for roadside diagnostics.</p>
                </div>
              </div>
              <div className="flex items-center space-x-8 p-8 glass-card border-none bg-white/[0.02] hover:bg-white/[0.04]">
                <Clock className="w-12 h-12 text-accent opacity-40 shrink-0" />
                <div>
                   <h4 className="text-lg font-black text-white italic uppercase mb-1">Response Time</h4>
                   <p className="text-slate-500 text-sm font-medium">98.4% of high-priority requests answered within 15 minutes.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 border-accent/10 relative h-full flex flex-col justify-center min-h-[600px]"
          >
            
            {formStatus === 'sent' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-10">
                  <CheckCircle2 className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic mb-6">Inquiry Received</h3>
                <p className="text-slate-500 font-medium max-w-[280px] mx-auto text-lg">Our specialists have received your inquiry. Strategy response incoming.</p>
                <button onClick={() => setFormStatus('idle')} className="mt-12 text-[10px] font-black text-accent uppercase tracking-widest hover:underline italic">Initialize New Inquiry</button>
              </motion.div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Identity</label>
                    <input 
                      required 
                      className="input-field py-5 px-6" 
                      placeholder="Full Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Point Of Contact</label>
                    <input 
                      required 
                      type="email" 
                      className="input-field py-5 px-6" 
                      placeholder="Email Address" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Subject Matter</label>
                  <div className="relative">
                    <select 
                      required 
                      className="input-field py-5 px-6 appearance-none bg-[#0a0c10] cursor-pointer text-slate-400 focus:text-white" 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="" disabled hidden>Choose Subject...</option>
                      <option value="Performance Consultation" className="bg-[#0a0c10]">Performance Consultation</option>
                      <option value="Emergency Recovery" className="bg-[#0a0c10]">Emergency Recovery</option>
                      <option value="Diagnostics Booking" className="bg-[#0a0c10]">Diagnostics Booking</option>
                      <option value="Corporate Fleet" className="bg-[#0a0c10]">Corporate Fleet</option>
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Detailed Inquiry</label>
                  <textarea 
                    required 
                    className="input-field py-5 px-6 min-h-[150px] resize-none" 
                    placeholder="Describe the performance issue or request in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button 
                  disabled={formStatus === 'sending'} 
                  type="submit" 
                  className="btn-primary w-full py-6 flex items-center justify-center space-x-4 disabled:opacity-50"
                >
                  {formStatus === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span>Engaging...</span>
                    </>
                  ) : (
                    <>
                      <span>Engage Specialist</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </section>

        {/* Map Placeholder */}
        <section className="py-32 px-6 max-w-[1400px] mx-auto mb-32">
          <h2 className="text-3xl font-black text-white italic uppercase italic mb-8">Strategic Locations</h2>
          <div className="w-full h-[500px] glass-card grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden relative border border-white/5">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3889.5639259899212!2d77.538099!3d12.871418000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDUyJzE3LjEiTiA3N8KwMzInMTcuMiJF!5e0!3m2!1sen!2sin!4v1775420032705!5m2!1sen!2sin" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="opacity-40 hover:opacity-100 transition-opacity duration-1000"
             ></iframe>
             <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                <div className="glass-card p-10 max-w-md text-center bg-[#050608]/80 pointer-events-auto">
                   <h3 className="text-xl font-black text-white italic mb-4 uppercase italic">Global HQ - Talaghattapura</h3>
                   <p className="text-slate-400 text-sm font-medium mb-8">Visit our showroom and diagnostic facility for on-the-spot performance modeling and luxury service lounge access.</p>
                   <a 
                      href="https://maps.app.goo.gl/ijopKg57KUg3iKEP8" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center space-x-3 text-[10px] font-black text-accent uppercase tracking-widest mx-auto hover:underline">
                     <span>Launch Navigation</span>
                     <ArrowRight className="w-4 h-4" />
                   </a>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
