import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
