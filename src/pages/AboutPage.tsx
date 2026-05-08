import { motion } from 'motion/react';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Trophy, Target, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-accent/30">
      <PublicNavbar />
      
      <main className="pt-40">
        {/* Story Section */}
        <section className="px-6 pb-32 overflow-hidden">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Our Heritage</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter italic uppercase leading-tight mb-8 max-w-2xl">
                Engineering <br />
                <span className="text-accent text-glow-accent">The Future</span> <br />
                <span className="text-gradient">Of Care.</span>
              </h1>

              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8 max-w-xl">
                Founded in 2011, Carlofy emerged from a simple realization: automotive maintenance shouldn't be a black box. Our founders, former performance engineers, set out to bring Formula-level precision to every vehicle and owner.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-accent transition-colors">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase italic">Excellence</h3>
                  <p className="text-sm text-slate-500 font-medium">Award-winning service across multiple high-performance categories.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase italic">Precision</h3>
                  <p className="text-sm text-slate-500 font-medium">Metric-driven results with verifiable performance diagnostics.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-accent/20 rounded-[40px] blur-[100px] opacity-20 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Workshop" 
                className="rounded-[30px] border border-white/10 shadow-2xl relative z-10 transition-transform duration-700 hover:scale-[1.02]"
              />
            </motion.div>
          </div>
        </section>

        {/* Mission Card Grid */}
        <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
          <div className="max-w-[1400px] mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight italic uppercase mb-4">The Carlofy Pillar</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic uppercase text-xs tracking-widest">Built on integrity, driven by innovation, and validated by performance.</p>
          </div>

          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Certification', desc: '100% OEM-certified master technicians with a minimum of 8 years experience.', icon: ShieldCheck },
              { title: 'Innovation', desc: 'Proprietary AI diagnostic systems for preventative maintenance modeling.', icon: Target },
              { title: 'Transparency', desc: 'Detailed digital reports including visual logs of every part replaced.', icon: Users },
              { title: 'Sustainability', desc: 'Leading the industry in eco-friendly fluid disposal and EV battery recycling.', icon: CheckCircle2 },
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 group glass-card-hover"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(217,255,63,0.1)]">
                  <pillar.icon className="w-8 h-8 text-accent group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-[0.2em] mb-4 group-hover:text-accent transition-colors">{pillar.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{pillar.desc}</p>
              </motion.div>

            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-32 px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '250+', label: 'Certified Staff' },
              { value: '12k+', label: 'Customer Reviews' },
              { value: '45+', label: 'Global Awards' },
              { value: '100%', label: 'Parts Guarantee' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center p-12 glass-card glass-card-hover"
                whileInView={{ scale: [0.95, 1.05, 1] }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-black text-accent italic tracking-tighter mb-4 text-glow-accent">{stat.value}</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-loose">{stat.label}</p>
              </motion.div>

            ))}
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-[1400px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-20 border-accent/20 bg-accent/[0.02] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] opacity-10 pointer-events-none" />
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight italic uppercase mb-8">Ready to experience <br /><span className="text-accent underline decoration-accent/20 underline-offset-8">Precision?</span></h2>
              <p className="text-slate-500 text-lg font-medium mb-12 max-w-2xl mx-auto">Join thousands of performance enthusiasts who trust Carlofy for their automotive engineering needs.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/role-selection" className="btn-primary flex items-center justify-center space-x-3 px-12 py-6">
                  <span>Start Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors italic border-b border-white/10 pb-2">
                  Consult a Specialist
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
