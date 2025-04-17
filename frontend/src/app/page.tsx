import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[url(/background.jpg)] bg-center bg-cover grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start bg-black opacity-70 rounded-2xl p-8">
        <div>
          <h1 className="font-bold text-lg md:text-5xl">CONTACT MANAGEMENT SYSTEM</h1>
          <p className="text-gray-600 mb-6">Manage your contacts efficiently and securely.</p>
        </div>  
       
        <div className="flex gap-4 items-center flex-col sm:flex-row m-auto">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/register"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Sign Up
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/login"
          >
            Log In
          </a>
        </div>
      </main>
     
    </div>
  );
}
