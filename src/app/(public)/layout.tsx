import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MiniChatbot from "@/components/MiniChatbot";
import MobileBottomNav from "@/components/MobileBottomNav";

import Script from "next/script";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <MiniChatbot />
      <MobileBottomNav />
    </>
  );
}
