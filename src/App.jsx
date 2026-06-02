import Navbar from './components/Navbar'
import HeadshotSequence from './components/HeadshotSequence'
import Hero from './components/Hero'
import LogoMarquee from './components/LogoMarquee'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Chatbot from './components/Chatbot'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>
        <HeadshotSequence />
        <Hero />
        <LogoMarquee />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Chatbot />
    </div>
  )
}
