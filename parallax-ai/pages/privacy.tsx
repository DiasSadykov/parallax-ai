import Footer from "@/components/footer";
import Header from "@/components/header";

//privacy policy page
export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content lg:w-1/3 flex-col ">
          <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
          Thank you for using Parallax AI. This privacy policy outlines the information we collect, how we use it, and how we protect your privacy. By using our tool, you agree to the terms of this privacy policy.
          <h1 className="text-xl font-bold"> Information we collect: </h1>
          Parallax AI collects user photos and email addresses to train the AI model. We collect this information only with your consent, and we do not collect any other information about you. We do not collect any other personally identifiable information, such as your name or location.
          <h1 className="text-xl font-bold"> How we use the information:</h1>
          We use the user photos and email addresses to train our AI model to generate avatars that look like the users. The photos and email addresses are used for this purpose only and are deleted after 24 hours. We do not use the photos or email addresses for any other purpose, and we do not share them with any third parties.
          <br/>
          <h1 className="text-xl font-bold">How we protect your privacy:</h1>
          We take your privacy seriously and have implemented measures to protect your information. We use industry-standard encryption to protect your data during transmission and storage. We limit access to your data to only those who need it to perform their duties. We do not sell or share your data with any third parties.
          <h1 className="text-xl font-bold">Your rights: </h1>
          You have the right to access, rectify, or delete any personal information we may have collected about you. If you would like to exercise any of these rights or have any questions about our privacy policy, please contact us at support@parallaxai.app.
          <h1 className="text-xl font-bold">Changes to our privacy policy: </h1>
          We reserve the right to update this privacy policy from time to time. If we make any material changes to the policy, we will notify you by posting a notice on our website or by email.
          <h1 className="text-xl font-bold">Contact us:</h1>
          If you have any questions or concerns about our privacy policy or the way we handle your data, please contact us at support@parallaxai.app.
          <p>This policy is effective as of 26 July 2021.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}