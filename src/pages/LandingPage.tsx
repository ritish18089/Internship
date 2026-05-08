import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Disc,
  Activity,
  Send,
  Gauge,
  Droplets,
  Wind,
  Settings,
  Battery
} from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

import heroCar from '../assets/hero-car.png';

export const LandingPage = () => {
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

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(217,255,63,0.15)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="py-10 max-w-5xl"
          >
            <div className="inline-flex items-center space-x-2 px-5 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8 md:mb-12">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[10px] md:text-[12px] font-black text-accent uppercase tracking-[0.4em]">Mastering the Art of Performance</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl lg:text-[150px] font-black text-white tracking-tighter italic uppercase leading-[0.85] md:leading-[0.75] mb-8 md:mb-12 selection:text-black">
              Precision <br />
              <span className="text-accent text-glow-accent">Performance</span> <br />
              <span className="text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.5)]">Redefined.</span>
            </h1>

            <p className="text-slate-400 mt-8 md:mt-12 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed px-4">
              Where heritage meets high-tech. Experience automotive care at the edge of possibility with Carlofy's digital garage.
            </p>

            <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
              <Link to="/role-selection" className="btn-primary flex items-center justify-center space-x-4 px-10 md:px-14 py-5 md:py-7 text-sm md:text-base w-full sm:w-auto">
                <span>Initiate Service</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-3" />
              </Link>
              <Link to="/services" className="flex items-center justify-center space-x-4 px-10 md:px-14 py-5 md:py-7 bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 rounded-xl transition-all font-black uppercase italic tracking-[0.2em] text-[10px] md:text-[12px] group w-full sm:w-auto">
                <span className="group-hover:text-accent transition-colors">Digital Showcase</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* About Us Section */}
      <section id="about" className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  { value: '15+', label: 'Years of Expertise' },
                  { value: '50k+', label: 'Cars Serviced' },
                  { value: '100%', label: 'Satisfaction Rate' },
                  { value: '24/7', label: 'Support Available' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 md:p-10 group glass-card-hover"
                  >
                    <h3 className="text-4xl md:text-5xl font-black text-accent italic mb-3 group-hover:scale-110 transition-transform origin-left text-glow-accent">{stat.value}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight italic uppercase mb-8 leading-tight">
                Engineering <span className="text-accent">Trust</span> <br />
                Through Innovation.
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                At Carlofy, we believe that car maintenance should be as advanced as the vehicles themselves. Our mission is to provide a transparent, efficient, and high-tech service experience for every car owner.
              </p>
              <ul className="space-y-4">
                {[
                  'Certified Master Technicians',
                  'State-of-the-art Diagnostic Tools',
                  'Genuine OEM Parts Only',
                  'Transparent Digital Reporting'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-300 font-bold italic">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-12">
                <Link to="/about" className="flex items-center space-x-3 text-accent text-[10px] font-black uppercase tracking-widest hover:underline italic group">
                  <span>Read Our Full Story</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight italic uppercase mb-4">Our Services</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Comprehensive automotive solutions tailored for high-performance and luxury vehicles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Full System Diagnostics', desc: 'Comprehensive AI-driven scan of all onboard electronics and modules.', icon: Gauge },
              { title: 'Brake System Overhaul', desc: 'Ceramic pad installation and fluid transfusion for zero-fade braking.', icon: ShieldCheck },
              { title: 'Performance Tuning', desc: 'Custom software maps and module programming for peak power.', icon: Zap },
              { title: 'Suspension Geometry', desc: 'Laser-guided alignment and damper calibration for aggressive handling.', icon: Settings },
              { title: 'Battery Health Check', desc: 'Cell-level analysis and charging profile optimization for EV systems.', icon: Battery },
              { title: 'Fluid Management', desc: 'OEM-spec synthetic fluid replacement for optimal operation.', icon: Droplets },
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-10 group hover:border-accent/50 transition-all"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent transition-colors">
                  <service.icon className="w-8 h-8 text-accent group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-4">{service.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{service.desc}</p>
                {/* Learn More link removed for consistency */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight italic uppercase mb-8">Get In Touch</h2>
              <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-12">
                Have questions or need a custom quote? Our team of experts is ready to assist you.
              </p>

              <div className="space-y-6 md:space-y-8">
                <a href="https://wa.me/message/VO7NPNOOEGEWD1" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 md:space-x-6 hover:text-accent transition-colors group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-accent group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp Us</p>
                    <p className="text-base md:text-lg font-bold text-white">9019854584</p>
                  </div>
                </a>
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Us</p>
                    <p className="text-base md:text-lg font-bold text-white">ritish1808@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Visit Us</p>
                    <a 
                      href="https://maps.app.goo.gl/ijopKg57KUg3iKEP8" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-base md:text-lg font-bold text-white hover:text-accent transition-colors block"
                    >
                      Talaghattapura
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 md:p-10 relative overflow-hidden">
              {formStatus === 'sent' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 md:py-20 text-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 md:mb-8">
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase italic mb-4">Message Sent</h3>
                  <p className="text-slate-500 font-medium max-w-[200px] text-sm">Our performance team will contact you shortly.</p>
                  <button onClick={() => setFormStatus('idle')} className="mt-8 text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Send Another</button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input 
                      required 
                      className="input-field" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      className="input-field" 
                      placeholder="you@gmail.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</label>
                  <input 
                    required 
                    className="input-field" 
                    placeholder="Service Inquiry" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message</label>
                  <textarea 
                    required 
                    className="input-field min-h-[150px] resize-none" 
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                  <button 
                    disabled={formStatus === 'sending'} 
                    type="submit" 
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
