import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Monitor, Code, BookOpen, GraduationCap, ArrowRight, User, Eye, Target, Award } from 'lucide-react';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const programs = [
    {
      title: 'BS Computer Science',
      description: 'Emphasizes the study of concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.',
      icon: <Code className="w-8 h-8 text-prmsu-gold" />,
    }
  ];

  const features = [
    { title: 'Modern Laboratories', value: 'State-of-the-art computer labs with high-speed internet and the latest software.' },
    { title: 'Expert Faculty', value: 'Learn from industry professionals and experienced academics committed to your success.' },
    { title: 'Industry Connections', value: 'Strong partnerships with tech companies for internships and job placements.' },
    { title: 'Research Opportunities', value: 'Engage in innovative research projects that solve real-world problems.' }
  ];

  return (
    <div className="min-h-screen font-sans text-prmsu-dark overflow-x-hidden">

      {/* Navigation */}
      <nav className={`fixed w-full z-50 bg-white border-b border-gray-100 transition-all duration-300 ${isScrolled ? 'shadow-md h-[70px]' : 'h-[80px]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="font-display font-extrabold text-lg tracking-tight text-prmsu-maroon transition-colors duration-300 group-hover:text-[#15803d]">
                The Smart University
              </div>
            </div>

            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-text-light hover:text-prmsu-maroon relative py-1 font-bold text-sm uppercase tracking-wide transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-prmsu-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">CCIT Home</a>
              <a href="#about" className="text-text-light hover:text-prmsu-maroon relative py-1 font-bold text-sm uppercase tracking-wide transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-prmsu-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">About CCIT</a>
              <a href="#programs" className="text-text-light hover:text-prmsu-maroon relative py-1 font-bold text-sm uppercase tracking-wide transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-prmsu-gold after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">We Offer</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-prmsu-dark hover:text-prmsu-maroon hover:bg-gray-50 transition-all duration-200 hover:scale-110 active:scale-90"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6 text-center">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="inline-block text-xl font-display font-bold text-prmsu-dark hover:text-prmsu-maroon hover:translate-x-2 transition-all duration-300">CCIT Home</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="inline-block text-xl font-display font-bold text-prmsu-dark hover:text-prmsu-maroon hover:translate-x-2 transition-all duration-300">About CCIT</a>
              <a href="#programs" onClick={() => setIsMobileMenuOpen(false)} className="inline-block text-xl font-display font-bold text-prmsu-dark hover:text-prmsu-maroon hover:translate-x-2 transition-all duration-300">We Offer</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/background_img/PRMSU.jpg"
            alt="PRMSU Campus"
            className="w-full h-full object-cover"
          />
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        {/* Top Edge Logos (Full Screen Width) */}
        <div className="absolute top-0 left-0 w-full px-6 md:px-12 lg:px-16 pt-16 md:pt-24 z-20 flex justify-between items-start pointer-events-none">
          {/* PRMSU Logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex-shrink-0 pointer-events-auto"
          >
            <img 
              src="/logo/prmsu_logo.png" 
              alt="PRMSU Logo" 
              className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* CCIT Logo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex-shrink-0 pointer-events-auto"
          >
            <img 
              src="/logo/ccit_logo.png" 
              alt="CCIT Logo" 
              className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center text-center">
          {/* Central Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center relative z-10"
          >
            <span className="text-prmsu-gold font-bold text-lg md:text-xl uppercase tracking-[3px] block mb-2 drop-shadow-md">
              President Ramon Magsaysay State University
            </span>
            <h1 className="text-4xl md:text-[64px] lg:text-[72px] font-extrabold text-white leading-[1.1] mb-2 font-display uppercase tracking-tight drop-shadow-lg">
              College of Communication And<br />Information Technology
            </h1>
            <span className="text-prmsu-gold font-bold text-base md:text-xl uppercase tracking-[4px] block mb-8 drop-shadow-sm">
              Castillejos Campus
            </span>
          </motion.div>
        </div>
      </section>

      {/* About Section replaced with Vision/Mission/Quality Policy */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-prmsu-gold/5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-prmsu-maroon/5 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-prmsu-dark uppercase tracking-wide"
            >
              PRMSU<span className="block mt-2 text-2xl md:text-3xl text-prmsu-maroon font-serif text-transparent bg-clip-text bg-gradient-to-r from-prmsu-maroon to-prmsu-gold">The Vision, Mission, and Quality Policy</span>
            </motion.h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="grid lg:grid-cols-3 gap-8 items-stretch"
          >
            {/* Vision */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(22, 101, 52, 0.4)" }}
              className="group relative bg-[#4a2e1f] p-3 rounded-lg shadow-2xl transition-all duration-300"
            >
              <div className="bg-[#f0ebe1] h-full p-8 md:p-10 border-2 border-prmsu-gold/30 shadow-inner flex flex-col items-center place-content-start rounded-sm">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-6 text-prmsu-gold group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 drop-shadow-sm" />
                </div>
                <h2 className="text-prmsu-maroon font-bold text-2xl uppercase tracking-[2px] mb-6 font-display inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-prmsu-gold after:rounded-full">VISION</h2>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed mt-4 text-center font-medium">
                  The President Ramon Magsaysay State University shall be a premier learner-centered and proactive university in a digital and global society.
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(22, 101, 52, 0.4)" }}
              className="group relative bg-[#4a2e1f] p-3 rounded-lg shadow-2xl transition-all duration-300"
            >
              <div className="bg-[#f0ebe1] h-full p-8 md:p-10 border-2 border-prmsu-gold/30 shadow-inner flex flex-col items-center place-content-start rounded-sm">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-6 text-prmsu-gold group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 drop-shadow-sm" />
                </div>
                <h2 className="text-prmsu-maroon font-bold text-2xl uppercase tracking-[2px] mb-6 font-display inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-prmsu-gold after:rounded-full">MISSION</h2>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed mt-4 text-center font-medium">
                  President Ramon Magsaysay State University shall primarily provide advance and higher professional, technical, and special instructions in various disciplines; undertake research, extension and income generation programs for the sustainable development of Zambales, the region and the country.
                </p>
              </div>
            </motion.div>

            {/* Quality Policy */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(22, 101, 52, 0.4)" }}
              className="group relative bg-[#4a2e1f] p-3 rounded-lg shadow-2xl transition-all duration-300"
            >
              <div className="bg-[#f0ebe1] h-full p-8 md:p-10 border-2 border-prmsu-gold/30 shadow-inner flex flex-col items-center place-content-start rounded-sm">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-6 text-prmsu-gold group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 drop-shadow-sm" />
                </div>
                <h2 className="text-prmsu-maroon font-bold text-2xl uppercase tracking-[2px] mb-6 font-display inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-prmsu-gold after:rounded-full">QUALITY POLICY</h2>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed mt-4 text-center font-medium">
                  The President Ramon Magsaysay State University is committed to continually strive for excellence in instruction, research, extension and production to strengthen global competitiveness adhering to quality standards for the utmost satisfaction of its valued customers.
                </p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Goals & Objectives Section */}
      <section id="goals" className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-prmsu-maroon font-bold tracking-wider text-sm uppercase mb-3">College Direction</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-prmsu-dark mb-6">Goals of the College</h3>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-600 text-lg leading-relaxed">
                  The College of Communication and Information Technology is committed to become a center of development in the fields of computing, information and communication technology, research and extension through offering extensive curricular programs at pace with emerging technologies and state-of-the-art-facilities, developing ethically responsible experts in the field, and strengthening linkages with the private sector, government sector and to the global academic community.
                </p>
              </div>
            </motion.div>

            {/* Objectives */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-prmsu-gold font-bold tracking-wider text-sm uppercase mb-3">Target Outcomes</h2>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-prmsu-dark mb-6">Program Objectives</h3>
              <p className="text-gray-600 mb-6 text-lg font-medium">
                The Bachelor of Science in Computer Science aims to:
              </p>
              <div className="space-y-6">
                {[
                  "Prepare graduates to be equipped with the principles and theories of computing leading to the conduct of research and advanced studies;",
                  "Develop globally competitive and well-rounded CS professionals and researchers, proficient in designing and developing computing solutions; and",
                  "Produce morally upright leaders in the fast-changing ICT industry."
                ].map((obj, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-prmsu-maroon text-prmsu-gold flex items-center justify-center font-bold text-sm shadow-sm border border-prmsu-maroon/20">
                        {idx + 1}
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {obj}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-prmsu-maroon font-bold tracking-wider text-sm uppercase mb-3">Our Offering</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-prmsu-dark mb-6">Academic Program</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Our premier computing program is specially designed to equip you with the skills demanded by today's ever-changing digital economy.
              </p>

              <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-prmsu-maroon/5 flex items-center justify-center flex-shrink-0">
                    <Code className="w-7 h-7 text-prmsu-gold" />
                  </div>
                  <h4 className="text-3xl font-display font-bold text-prmsu-dark">BS Computer Science</h4>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Emphasizes the study of concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.
                </p>
              </div>

              <a href="#" className="inline-flex items-center text-white bg-prmsu-maroon hover:bg-[#681923] font-semibold px-8 py-4 rounded-xl group transition-all shadow-md hover:shadow-lg">
                Learn more <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Right Side: Card with 3D Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Visual Card / Frame */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden group">
                {/* Decorative background blurs inside card */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-prmsu-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-prmsu-maroon/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative rounded-2xl overflow-hidden aspect-square sm:aspect-video lg:aspect-[4/3] bg-white shadow-sm border border-white/50">
                  {/* 3D Image representing Computer Science */}
                  <img
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="3D Computer Science Illustration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Floating badge for extra 3D effect feeling */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/90 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-prmsu-maroon/10 flex items-center justify-center flex-shrink-0">
                        <Code className="w-6 h-6 text-prmsu-maroon" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Future-Ready Skills</p>
                        <p className="text-sm text-gray-600 line-clamp-1">Master modern computing & algorithms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-prmsu-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-prmsu-gold font-bold tracking-wider text-sm uppercase mb-3">Why Choose Us</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">The CCIT Advantage</h3>
              <p className="text-gray-400 mb-8 text-lg">
                We don't just teach code; we build the next generation of tech leaders, innovators, and problem solvers.
              </p>

              <div className="space-y-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1 placeholder">
                      <div className="w-6 h-6 rounded-full border-2 border-prmsu-gold flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-prmsu-gold"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative pt-8 md:pt-0">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" alt="Students coding" className="rounded-2xl h-64 object-cover w-full mt-12" />
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Collaboration" className="rounded-2xl h-64 object-cover w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row justify-between items-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} President Ramon Magsaysay State University - Castillejos Campus. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
