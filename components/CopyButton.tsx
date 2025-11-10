"use client";

export default function CopyButton({ ip }: { ip: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(ip);
        alert("IP address copied to clipboard!");
      }}
      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    >
      Copy IP
    </button>
  );
}

