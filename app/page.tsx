import { headers } from "next/headers";
import CopyButton from "@/components/CopyButton";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const headersList = await headers();
  
  const ip = headersList.get("cf-connecting-ip") || 
             headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || 
             headersList.get("x-real-ip") || 
             "Unknown";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">
          Your IP Address
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <div className="text-5xl md:text-7xl font-mono font-bold text-indigo-600 mb-4">
            {ip}
          </div>
          <CopyButton ip={ip} />
        </div>
      </div>
    </main>
  );
}
