import Footer from "@/components/footer";
import Header from "@/components/header";

//privacy policy page
export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content lg:w-1/3 flex-col ">
          <h1 className="text-4xl font-extrabold text-center">Payment Success</h1>
          Thank you for your payment. We will send you an email with confirmation shortly.
          Avatars generation time is about 30 minutes. We will send you an email when your avatars are ready.
        </div>
      </div>
      <Footer />
    </>
  );
}