"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  Building,
  CheckCircle,
  Upload,
  FileText,
  X,
  Download,
  AlertCircle,
  Camera,
  File,
} from "lucide-react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useCompanyUploadMutation } from "@/hooks/useCompany";
import { parseError } from "@/utils/parseError";
import { useToast } from "@/components/shared/ToastProvider";
import { useRouter } from "next/navigation";
import LeftBanner from "./components/LeftBanner";
import { StepIndicator } from "../components/RegisterSteps";
import {
  CompanyDetailsDtoEmployeesNumber,
  CompanyDetailsDtoYearsInBusiness,
  RegisterDtoRole,
} from "@/api";
import { useUserRegistrationStore } from "@/store/useAdminRegistrationStore";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  preview?: string;
}

enum UploadStatus {
  UPLOADING = "uploading",
  COMPLETED = "completed",
  ERROR = "error",
}

export default function ProviderRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, UploadedFile[]>
  >({
    license: [],
    certifications: [],
    insurance: [],
    financial: [],
  });
  const [dragActive, setDragActive] = useState<string | null>(null);
  const { printMessage } = useToast();
  const router = useRouter();
  const { uploadCompanyDocuments } = useCompanyUploadMutation();

  const [formData, setFormData] = useState({
    // Personal & Account Info (collected separately)
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Company Info
    companyName: "",
    companyType: "",
    licenseNumber: "",
    businessAddress: "",
    yearsInBusiness: "0-1 years",
    employeeCount: "1-10 employees",
    website: "",

    // Contact Info
    businessPhone: "",
    businessEmail: "",
    contactPerson: "",
    contactTitle: "",

    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToCompliance: false,
  });

  const { register: registerAdmin } = useAuth();
  const userInfo = useUserRegistrationStore((state) => state.data);
  const resetUserInfo = useUserRegistrationStore((state) => state.reset);

  useEffect(() => {
    if (!userInfo.email) {
      router.push("/auth/register");
    }
  }, [userInfo.email, router]);

  const documentTypes = [
    {
      id: "license",
      title: "Business License & Registration",
      description: "Official business registration and operating license",
      required: true,
      maxFiles: 3,
      acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    },
    {
      id: "certifications",
      title: "Insurance License Certificate",
      description: "Professional insurance license and certifications",
      required: true,
      maxFiles: 5,
      acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    },
  ];

  const handleDrag = useCallback((e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docType);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files, docType);
    }
  }, []);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files, docType);
    }
  };

  const handleFileUpload = (files: File[], docType: string) => {
    const docConfig = documentTypes.find((doc) => doc.id === docType);
    if (!docConfig) return;

    const currentFiles = uploadedFiles[docType] || [];
    const remainingSlots = docConfig.maxFiles - currentFiles.length;
    const filesToUpload = files.slice(0, remainingSlots);

    filesToUpload.forEach((file) => {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      // Validate file type
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!docConfig.acceptedFormats.includes(fileExtension)) {
        alert(
          `File ${file.name} has an unsupported format. Accepted formats: ${docConfig.acceptedFormats}`
        );
        return;
      }

      const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        file,
        progress: 0,
        status: UploadStatus.UPLOADING,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles((prev) => ({
            ...prev,
            [docType]: prev[docType].map((f) =>
              f.id === fileId
                ? { ...f, preview: e.target?.result as string }
                : f
            ),
          }));
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [docType]: [...(prev[docType] || []), newFile],
      }));

      // Simulate upload progress
      const interval = setInterval(() => {
        let shouldClear = false;

        setUploadedFiles((prev) => {
          const updated = {
            ...prev,
            [docType]: prev[docType].map((f) => {
              if (f.id === fileId) {
                const newProgress = Math.min(
                  f.progress + Math.random() * 30,
                  100
                );
                if (newProgress >= 100) {
                  shouldClear = true;
                  return {
                    ...f,
                    progress: 100,
                    status: UploadStatus.COMPLETED,
                  };
                }
                return { ...f, progress: newProgress };
              }
              return f;
            }),
          };

          return updated;
        });

        if (shouldClear) {
          clearInterval(interval);
        }
      }, 200);
    });
  };

  const removeFile = (docType: string, fileId: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: prev[docType].filter((f) => f.id !== fileId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const res = await registerAdmin({
          email: userInfo.email,
          password: userInfo.password,
          confirmPassword: userInfo.confirmPassword,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: RegisterDtoRole.insurance_admin,
          phone: userInfo.phone,
          company: {
            name: formData.companyName,
            address: formData.businessAddress,
            license_number: formData.licenseNumber,
            contact_no: formData.businessPhone,
            website: formData.website,
            years_in_business:
              formData.yearsInBusiness as CompanyDetailsDtoYearsInBusiness,
            employees_number:
              formData.employeeCount as CompanyDetailsDtoEmployeesNumber,
          },
        });
        const companyId = (res as any)?.data?.companyId ?? "";
        const companyDocs = Object.values(uploadedFiles)
          .flat()
          .map((f) => f.file);
        if (companyDocs.length) {
          try {
            await uploadCompanyDocuments(String(companyId), {
              files: companyDocs,
            });
          } catch (uploadErr) {
            console.error(uploadErr);
          }
        }
        printMessage("Account created successfully", "success");
        resetUserInfo();
        router.push("/auth/login");
        router.refresh();
      } catch (err) {
        console.error(err);
        console.error("Registration failed:", err);
        printMessage(parseError(err) || "Registration failed", "error");
      }
    }
  };


  const renderCompanyInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Company Information
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us about your insurance business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Company Name *
          </label>
          <Input
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            placeholder="Your company name"
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            License Number *
          </label>
          <Input
            value={formData.licenseNumber}
            onChange={(e) =>
              setFormData({ ...formData, licenseNumber: e.target.value })
            }
            placeholder="Insurance license number"
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Years in Business *
          </label>
          <Select
            value={formData.yearsInBusiness}
            onValueChange={(value) =>
              setFormData({ ...formData, yearsInBusiness: value })
            }
          >
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1 years">0-1 years</SelectItem>
              <SelectItem value="2-5 years">2-5 years</SelectItem>
              <SelectItem value="6-10 years">6-10 years</SelectItem>
              <SelectItem value="11-20 years">11-20 years</SelectItem>
              <SelectItem value="20+ years">20+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Employees
          </label>
          <Select
            value={formData.employeeCount}
            onValueChange={(value) =>
              setFormData({ ...formData, employeeCount: value })
            }
          >
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select employee count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10 employees">1-10 employees</SelectItem>
              <SelectItem value="11-50 employees">11-50 employees</SelectItem>
              <SelectItem value="51-200 employees">51-200 employees</SelectItem>
              <SelectItem value="201-500 employees">
                201-500 employees
              </SelectItem>
              <SelectItem value="500+ employees">500+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Business Address *
        </label>
        <Textarea
          value={formData.businessAddress}
          onChange={(e) =>
            setFormData({ ...formData, businessAddress: e.target.value })
          }
          placeholder="Enter your complete business address"
          className="form-input"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Business Phone *
          </label>
          <Input
            type="tel"
            value={formData.businessPhone}
            onChange={(e) =>
              setFormData({ ...formData, businessPhone: e.target.value })
            }
            placeholder="Business phone number"
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Website
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://yourcompany.com"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Required Documentation
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Upload the required documents to verify your business
        </p>
      </div>

      {documentTypes.map((docType) => (
        <div key={docType.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
                {docType.title}
                {docType.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {docType.description}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              {uploadedFiles[docType.id]?.length || 0} / {docType.maxFiles}
            </Badge>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive === docType.id
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30"
            }`}
            onDragEnter={(e) => handleDrag(e, docType.id)}
            onDragLeave={(e) => handleDrag(e, docType.id)}
            onDragOver={(e) => handleDrag(e, docType.id)}
            onDrop={(e) => handleDrop(e, docType.id)}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 dark:text-slate-300 mb-2">
              Drag and drop files here, or{" "}
              <label className="text-emerald-600 dark:text-emerald-400 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300">
                browse
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept={docType.acceptedFormats}
                  onChange={(e) => handleFileSelect(e, docType.id)}
                />
              </label>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Supported formats:{" "}
              {docType.acceptedFormats.replace(/\./g, "").toUpperCase()} • Max
              10MB per file
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles[docType.id]?.length > 0 && (
            <div className="space-y-3">
              {uploadedFiles[docType.id].map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <File className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-1" />
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Uploading... {Math.round(file.progress)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    )}
                    {file.status === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(docType.id, file.id)}
                      className="h-8 w-8 p-0 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderTermsAndSubmit = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Terms & Conditions
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Review and accept our terms to complete registration
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreeToTerms: checked as boolean })
            }
            className="mt-1"
          />
          <label
            htmlFor="terms"
            className="text-sm text-slate-700 dark:text-slate-300"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              Terms of Service
            </Link>{" "}
            and understand that my account will be subject to verification and
            regulatory compliance.
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy"
            checked={formData.agreeToPrivacy}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreeToPrivacy: checked as boolean })
            }
            className="mt-1"
          />
          <label
            htmlFor="privacy"
            className="text-sm text-slate-700 dark:text-slate-300"
          >
            I agree to the{" "}
            <Link
              href="/privacy"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              Privacy Policy
            </Link>{" "}
            and consent to the processing of my personal and business data.
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="compliance"
            checked={formData.agreeToCompliance}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                agreeToCompliance: checked as boolean,
              })
            }
            className="mt-1"
          />
          <label
            htmlFor="compliance"
            className="text-sm text-slate-700 dark:text-slate-300"
          >
            I certify that all information provided is accurate and that my
            business complies with all applicable insurance regulations and
            licensing requirements.
          </label>
        </div>
      </div>

      <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-700/50">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h4 className="font-medium text-emerald-700 dark:text-emerald-300">
            Verification Process
          </h4>
        </div>
        <p className="text-emerald-600 dark:text-emerald-200 text-sm">
          Your application will undergo a comprehensive verification process
          including document review, license validation, and compliance checks.
          This typically takes 3-5 business days.
        </p>
      </div>

      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h4 className="font-medium text-blue-700 dark:text-blue-300">
            What Happens Next?
          </h4>
        </div>
        <ul className="text-blue-600 dark:text-blue-200 text-sm space-y-1">
          <li>• Document verification and compliance review</li>
          <li>• License validation with regulatory authorities</li>
          <li>• Background check and financial assessment</li>
          <li>• Platform onboarding and training materials</li>
          <li>• Account activation and access credentials</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Banner */}
      <LeftBanner />

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 group mb-8 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Registration</span>
            </Link>

            <div className="lg:hidden mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} />
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Provider Registration
            </h2>
            {/* Registration Form */}
            <Card className="glass-card rounded-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && renderCompanyInfo()}
                  {currentStep === 2 && renderDocumentUpload()}
                  {currentStep === 3 && renderTermsAndSubmit()}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="floating-button"
                      >
                        Previous
                      </Button>
                    )}

                    <Button
                      type="submit"
                      disabled={
                        currentStep === 3 &&
                        (!formData.agreeToTerms ||
                          !formData.agreeToPrivacy ||
                          !formData.agreeToCompliance)
                      }
                      className="gradient-accent text-white floating-button ml-auto"
                    >
                      {currentStep === 3 ? "Submit Application" : "Continue"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
