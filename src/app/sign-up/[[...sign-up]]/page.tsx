import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center items-center p-4">
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="Mahanaim NGO Logo"
            width={220}
            height={60}
            priority
            className="h-14 w-auto object-contain mx-auto"
          />
        </Link>
        <p className="text-xs text-brandTeal-600 font-semibold italic">Spread Love.... Spread Peace....</p>
      </div>

      <div className="shadow-2xl rounded-3xl overflow-hidden">
        <SignUp />
      </div>
    </div>
  );
}
