import { useEffect } from 'react'
import Hero from '../components/Hero'
import OffreMoment from '../components/OffreMoment'
import CircuitsPreview from '../components/CircuitsPreview'
import AboutMadagascar from '../components/AboutMadagascar'
import Testimonials from '../components/Testimonials'
import VideoSection from '../components/VideoSection'
import './Home.css'

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.revealDelay ?? 0
            setTimeout(() => {
              entry.target.dataset.visible = 'true'
            }, Number(delay) * 120)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <OffreMoment />
      <CircuitsPreview />
      <AboutMadagascar />
      <Testimonials />
      <VideoSection />
    </>
  )
}
