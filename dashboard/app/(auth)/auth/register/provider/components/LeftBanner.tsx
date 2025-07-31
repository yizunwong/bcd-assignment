import { Building, Globe, Zap, Shield } from "lucide-react";

export default function LeftBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex flex-col justify-center px-12 text-white">
        <div className="mb-8">
          <div className="w-16 h-16 mb-6 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Partner with Coverly</h1>
          <p className="text-xl text-purple-100 mb-8">
            Join our network of trusted insurance providers and revolutionize the industry with blockchain technology.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Global Reach</h3>
              <p className="text-purple-100 text-sm">Access to worldwide customer base</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Automated Operations</h3>
              <p className="text-purple-100 text-sm">Smart contracts reduce operational costs</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Enhanced Security</h3>
              <p className="text-purple-100 text-sm">Blockchain-secured transactions and data</p>
            </div>
          </div>
        </div>
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-purple-100 text-sm">Partner Providers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$2.5B+</div>
              <div className="text-purple-100 text-sm">Claims Processed</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
}
