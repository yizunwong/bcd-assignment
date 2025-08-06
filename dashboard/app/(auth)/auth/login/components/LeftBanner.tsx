import { Shield, Zap, Globe } from "lucide-react";

export default function LeftBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex flex-col justify-center px-12 text-white">
        <div className="mb-8">
          <div className="w-16 h-16 mb-6 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome Back to Coverly</h1>
          <p className="text-xl text-emerald-100 mb-8">
            Access your decentralized insurance dashboard and manage your
            policies with blockchain security.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Secure & Transparent</h3>
              <p className="text-emerald-100 text-sm">All transactions recorded on blockchain</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Instant Payouts</h3>
              <p className="text-emerald-100 text-sm">Smart contracts automate secure payouts after claims are approved</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Global Coverage</h3>
              <p className="text-emerald-100 text-sm">Worldwide protection 24/7</p>
            </div>
          </div>
        </div>
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
          <div className="flex items-center justify-between text-sm">
            <span>Trusted by</span>
            <span className="font-bold">50,000+ users</span>
          </div>
        </div>
      </div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
}
