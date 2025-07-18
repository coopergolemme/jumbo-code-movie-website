"use client";
import StreamingProviders from "@/components/streaming-providers";

import SearchForm from "@/components/SearchForm";
export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <SearchForm />
        </div>
        <StreamingProviders />
      </div>
    </>
  );
}
