import Footer from "@/components/footer";
import Header from "@/components/header";

//privacy policy page
export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content lg:w-1/3 flex-col ">
          <h1 className="text-4xl font-extrabold">Terms and Conditions</h1>
          <br/><br/>
          Welcome to Parallax AI, a website that offers AI-generated avatars based on photos uploaded by users. By using the Service, you agree to comply with all applicable laws and regulations. You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Service or interfere with any other party&apos;s use of the Service. You further agree not to use the Service in any manner that could interfere with any servers or networks connected to the Service, or that could restrict or inhibit any other user from accessing or using the Service.
          <br/><br/>
          The Service requires payment in exchange for generating the avatars. You will be asked to checkout with a payment link and provide valid payment information. <b>We do not provide refunds since it is a computationally heavy service and we pay for GPU.</b>
          Parallax AI makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included in the Service. To the fullest extent permissible by applicable law, Parallax AI disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
          <br/><br/>
          Parallax AI will not be liable for any damages of any kind arising from the use of the Service, including but not limited to direct, indirect, incidental, punitive, and consequential damages. Parallax AI&apos;s total liability to you for any claim arising out of or related to these Terms or the Service will not exceed the amount paid by you to Parallax AI for the Service.
          <br/><br/>
          These Terms are governed by and construed in accordance with the laws of the jurisdiction where Parallax AI is registered.
        </div>
      </div>
      <Footer />
    </>
  );
}