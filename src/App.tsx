import Header from './components/Header'
import Hero from './components/Hero'
import Facts from './components/Facts'
import Places from './components/Places'
import Food from './components/Food'
import Festivals from './components/Festivals'
import Districts from './components/Districts'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Facts />
        <Places />
        <Food />
        <Festivals />
        <Districts />
      </main>
      <Footer />
    </>
  )
}
