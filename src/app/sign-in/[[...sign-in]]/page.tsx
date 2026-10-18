import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-block group">
          <Image
            src="/logo.png"
            alt="Mahanaim NGO Logo"
            width={220}
            height={60}
            priority
            className="h-12 w-auto object-contain mx-auto transition-transform group-hover:scale-105 dark:brightness-110"
          />
        </Link>
        <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold italic">
          Spread Love.... Spread Peace....
        </p>
      </div>

      <div className="shadow-2xl rounded-3xl overflow-hidden border border-border/80">
        <SignIn />
      </div>
    </div>
  );
}
