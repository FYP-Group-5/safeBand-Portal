import Image from "next/image";
import { Shield, Lock } from "lucide-react";

interface ResponderActivateHeaderProps {
  mode: "activation" | "activated";
}

export default function ResponderActivateHeader({
  mode,
}: ResponderActivateHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-sm px-6 py-6 lg:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary-dark flex size-10 items-center justify-center rounded-lg text-white">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-primary-dark text-xl font-bold tracking-tight">
          SafeBand
        </h2>
      </div>

      {mode === "activation" ? (
        <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
          <Lock className="h-5 w-5" />
          Secure Activation
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm font-medium text-slate-900">Responder Account</p>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 p-1">
            <div className="bg-cover bg-center relative size-10 overflow-hidden rounded-full bg-slate-200">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwoTsklFXm8U2FJB15RuPQw-SY7fEUMNTc40yh03ERQLLW7MymcC_vnYNuY7tieXlNJ6WKB8zmq51kIy7bAQpNRhcnUvJlfAzihJ1SUbYJwzE1n5JNNbty7hVaUyq4A93HdGWpw6P9pHFwTDquWU-QQh25mZ0zh4azh0U0e9t246VO2AgzbggnbSKwHDqlDGw-0FQGc3TFgOiB-79qXwu-sMB3JrihNdjLXhxWLqj3N0WbafgiDGLlXDWxu4foFSpNQ3FoXNcA1Q"
                alt="User profile avatar of a responder"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}