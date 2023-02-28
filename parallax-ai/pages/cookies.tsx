import Footer from "@/components/footer";
import Header from "@/components/header";

//privacy policy page
export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content lg:w-1/3 flex-col ">
          <h1 className="text-4xl font-extrabold">Cookie Policy</h1>
          Our website uses cookies to enable Google OAuth authentication. In this policy, we explain what cookies are, why they are necessary, and how they are used on our website.
          <h1 className="text-xl font-bold"> What are cookies? </h1>
          Cookies are small text files that are stored on a user&apos;s device when they visit a website. They contain information about the user&apos;s visit, including preferences, login details, and browsing history.
          <h1 className="text-xl font-bold"> Why are cookies necessary?</h1>
          Cookies are necessary for authentication purposes, which is important for the security of our website. When you use Google OAuth to sign in to our website, we use cookies to authenticate your login and ensure that you have access to the appropriate content.
          <br/>
          <h1 className="text-xl font-bold">How are cookies used?</h1>
          We use cookies to remember your login details so that you don&apos;t have to enter them every time you visit our website.
          <h1 className="text-xl font-bold">Managing cookies:</h1>
          You can manage cookies on our website by deleting cookies from your browser or disabling cookies in your browser settings.
          However, please note that disabling cookies may affect the functionality of our website.
          <h1 className="text-xl font-bold">Privacy policy:</h1>
          For more information on how we collect, use, and protect your personal data, please refer to our privacy policy.
        </div>
      </div>
      <Footer />
    </>
  );
}