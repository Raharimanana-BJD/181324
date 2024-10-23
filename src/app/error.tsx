"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Component() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement error reporting functionality here
    console.log("Reporting error with email:", email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-25 animate-ping"></div>
          <AlertTriangle className="relative w-full h-full text-red-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Oops! Something went wrong
        </h1>
        <p className="text-xl text-secondary mb-8">
          We&apos;re experiencing some technical difficulties. Our team has been
          notified and is working on a fix.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            className="w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-2 h-4 w-4" /> Go to Homepage
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Report this error</h2>
          <p className="text-sm text-gray-500 mb-4">
            If the problem persists, please let us know and we&apos;ll look into
            it.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow"
              required
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
