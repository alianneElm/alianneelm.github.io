import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import SoftSkills from './components/SoftSkills'
import Languages from './components/Languages'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#050508' }}>
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Experience />
      <Certifications />
      <SoftSkills />
      <Languages />
      <Footer />
    </div>
  )
}
