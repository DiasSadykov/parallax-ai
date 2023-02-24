import Footer from '@/components/footer'
import Form from '@/components/form'
import Header from '@/components/header'

export default function Home() {
  return (
    <>
    <Header/>
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img src="https://astanatimes.com/wp-content/uploads/2023/01/akshakar-700x691.jpeg" className="max-w-sm  rounded-lg shadow-2xl" />
        <Form/>
      </div>
    </div>
    <Footer/>
    </>
    )
}
