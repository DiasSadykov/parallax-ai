import Footer from '@/components/footer'
import Hero from '@/components/hero'
import Header from '@/components/header'
import KazakhStyle from '@/components/kazakhStyle'
import PictureSelector from '@/components/pictureSelector'
import Steps from '@/components/steps'

export default function Home() {
  return (
    <>
    <Header/>
    <Hero/>
    <PictureSelector/>
    <div className="divider">ALSO</div>
    <KazakhStyle/>
    <Steps/>
    <Footer/>
    </>
    )
}
