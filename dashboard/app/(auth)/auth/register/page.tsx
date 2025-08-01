"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  ArrowRight,
  User,
  Building,
  DollarSign,
  Eye,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/components/shared/ToastProvider";
import { parseError } from "@/utils/parseError";
import { useUserRegistrationStore } from "@/store/useAdminRegistrationStore";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { StepIndicator, RoleSelection, BasicInfo, RoleSpecificInfo, Role } from "./components/RegisterSteps";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string>(searchParams.get("role") || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { register: registerUser, isRegistering } = useAuth();
  const { printMessage } = useToast();
  const setRegistrationData = useUserRegistrationStore((state) => state.setData);

  const countryOptions = getCountries().map((countryCode) => ({
    code: countryCode,
    dialCode: `+${getCountryCallingCode(countryCode)}`,
  }));

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneCode: "+60",
    phone: "",
    dateOfBirth: "",
    address: "",
    occupation: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  const roles: Role[] = [
    {
      id: "policyholder",
      title: "Individual/Policyholder",
      description: "Personal insurance coverage for individuals and families",
      icon: User,
      gradient: "from-blue-500 to-teal-500",
    },
    {
      id: "admin",
      title: "Insurance Provider",
      description: "Insurance companies, brokers, and service providers",
      icon: Building,
      gradient: "from-emerald-500 to-green-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    const fullPhoneNumber = `${formData.phoneCode}${formData.phone}`;
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (selectedRole === "admin") {
        setRegistrationData({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: fullPhoneNumber,
        });
        router.push("/auth/register/provider");
      } else {
        try {
          await registerUser({
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: "policyholder",
            phone: fullPhoneNumber,
            dateOfBirth: formData.dateOfBirth,
            occupation: formData.occupation,
            address: formData.address,
          });
          printMessage("Account created successfully", "success");
          router.push("/auth/login");
          router.refresh();
        } catch (err) {
          printMessage(parseError(err) || "Registration failed", "error");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="w-16 h-16 mb-6 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Join the Insurance Revolution</h1>
              <p className="text-xl text-emerald-100 mb-8">Experience the future of insurance with blockchain technology, instant payouts, and complete transparency.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Coverage</h3>
                  <p className="text-emerald-100 text-sm">Get protected in minutes, not days</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Lower Costs</h3>
                  <p className="text-emerald-100 text-sm">Save up to 40% vs traditional insurance</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Full Transparency</h3>
                  <p className="text-emerald-100 text-sm">Every transaction visible on blockchain</p>
                </div>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-emerald-100 text-sm">Policies Issued</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold">$125M+</div>
                <div className="text-emerald-100 text-sm">Value Protected</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-emerald-100 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-lg w-full">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center space-x-2 group mb-8 text-slate-400 hover:text-emerald-400 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <div className="lg:hidden mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Create Your Account</h1>
              <p className="text-slate-600 dark:text-slate-400">Join the future of decentralized insurance</p>
            </div>
            <StepIndicator currentStep={currentStep} />
            <Card className="glass-card rounded-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && <RoleSelection roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />}
                  {currentStep === 2 && (
                    <BasicInfo
                      formData={formData}
                      setFormData={setFormData}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      showConfirmPassword={showConfirmPassword}
                      setShowConfirmPassword={setShowConfirmPassword}
                    />
                  )}
                  {currentStep === 3 && (
                    <RoleSpecificInfo selectedRole={selectedRole} formData={formData} setFormData={setFormData} />
                  )}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="floating-button">
                        Previous
                      </Button>
                    )}
                    <Button
                      type="submit"
                      loading={isRegistering}
                      disabled={(currentStep === 1 && !selectedRole) || (currentStep === 3 && (!formData.agreeToTerms || !formData.agreeToPrivacy))}
                      className="gradient-accent text-white floating-button ml-auto"
                    >
                      {currentStep === 3 ? selectedRole === "admin" ? (
                        <>
                          Continue to Provider Setup
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        "Create Account"
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="text-center mt-6">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
