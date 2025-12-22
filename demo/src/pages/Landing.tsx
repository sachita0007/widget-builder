import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Star, Zap, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
               <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-slate-900">Freestand</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="rounded-full">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link href="/api/login">
                <Button className="rounded-full px-6">Log In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          New: Google-style review templates
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight mb-6 max-w-4xl"
        >
          Turn product sampling into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">verified trust.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-500 mb-10 max-w-2xl"
        >
          Collect authentic reviews from your sampling campaigns and showcase them with our beautiful, customizable embeddable widgets.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/api/login">
            <Button size="lg" className="rounded-full h-12 px-8 text-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all">
              Start Free Trial
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-lg">
            View Demo
          </Button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <LayoutTemplate className="w-6 h-6" />, 
                title: "Beautiful Templates", 
                desc: "Choose from aggregated, grid, or Google-style layouts that match your brand perfectly." 
              },
              { 
                icon: <ShieldCheck className="w-6 h-6" />, 
                title: "Verified Trust", 
                desc: "Every review carries our 'Verified by Freestand' seal, proving authenticity to your customers." 
              },
              { 
                icon: <Zap className="w-6 h-6" />, 
                title: "Instant Embed", 
                desc: "Copy one line of code to add reviews to Shopify, WooCommerce, or any custom site." 
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
