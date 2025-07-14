"use client";

import { useState, useCallback } from "react";
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

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

export default function ProviderRegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    yearsInBusiness: "",
    employeeCount: "",
    website: "",
    taxId: "",

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
    {
      id: "insurance",
      title: "Professional Liability Insurance",
      description:
        "Proof of professional liability and errors & omissions coverage",
      required: true,
      maxFiles: 2,
      acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    },
    {
      id: "financial",
      title: "Financial Statements",
      description: "Audited financial statements for the last 2 years",
      required: false,
      maxFiles: 4,
      acceptedFormats: ".pdf",
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
        status: "uploading",
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
        setUploadedFiles((prev) => ({
          ...prev,
          [docType]: prev[docType].map((f) => {
            if (f.id === fileId) {
              const newProgress = Math.min(
                f.progress + Math.random() * 30,
                100
              );
              if (newProgress >= 100) {
                clearInterval(interval);
                return { ...f, progress: 100, status: "completed" };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          }),
        }));
      }, 200);
    });
  };

  const removeFile = (docType: string, fileId: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: prev[docType].filter((f) => f.id !== fileId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Registration data:", {
        ...formData,
        documents: uploadedFiles,
      });
      // Handle registration logic here
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep
                ? "bg-emerald-500 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderCompanyInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Company Information
        </h3>
        <p className="text-slate-600">Tell us about your insurance business</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Name *
          </label>
          <Input
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            placeholder="Your company name"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Company Type *
          </label>
          <Select
            value={formData.companyType}
            onValueChange={(value) =>
              setFormData({ ...formData, companyType: value })
            }
          >
            <SelectTrigger className="bg-white/50 border-slate-200 text-slate-900">
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insurance-company">
                Insurance Company
              </SelectItem>
              <SelectItem value="broker">Insurance Broker</SelectItem>
              <SelectItem value="agent">Insurance Agent</SelectItem>
              <SelectItem value="reinsurer">Reinsurer</SelectItem>
              <SelectItem value="mga">Managing General Agent</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            License Number *
          </label>
          <Input
            value={formData.licenseNumber}
            onChange={(e) =>
              setFormData({ ...formData, licenseNumber: e.target.value })
            }
            placeholder="Insurance license number"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tax ID / EIN *
          </label>
          <Input
            value={formData.taxId}
            onChange={(e) =>
              setFormData({ ...formData, taxId: e.target.value })
            }
            placeholder="Federal Tax ID or EIN"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Years in Business *
          </label>
          <Select
            value={formData.yearsInBusiness}
            onValueChange={(value) =>
              setFormData({ ...formData, yearsInBusiness: value })
            }
          >
            <SelectTrigger className="bg-white/50 border-slate-200 text-slate-900">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="2-5">2-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="11-20">11-20 years</SelectItem>
              <SelectItem value="20+">20+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Number of Employees
          </label>
          <Select
            value={formData.employeeCount}
            onValueChange={(value) =>
              setFormData({ ...formData, employeeCount: value })
            }
          >
            <SelectTrigger className="bg-white/50 border-slate-200 text-slate-900">
              <SelectValue placeholder="Select employee count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="500+">500+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Business Address *
        </label>
        <Textarea
          value={formData.businessAddress}
          onChange={(e) =>
            setFormData({ ...formData, businessAddress: e.target.value })
          }
          placeholder="Enter your complete business address"
          className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Business Phone *
          </label>
          <Input
            type="tel"
            value={formData.businessPhone}
            onChange={(e) =>
              setFormData({ ...formData, businessPhone: e.target.value })
            }
            placeholder="Business phone number"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Website
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="https://yourcompany.com"
            className="bg-white/50 border-slate-200 text-slate-900 placeholder-slate-500"
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Required Documentation
        </h3>
        <p className="text-slate-600">
          Upload the required documents to verify your business
        </p>
      </div>

      {documentTypes.map((docType) => (
        <div key={docType.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                {docType.title}
                {docType.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h4>
              <p className="text-sm text-slate-600">{docType.description}</p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-slate-200 text-slate-700"
            >
              {uploadedFiles[docType.id]?.length || 0} / {docType.maxFiles}
            </Badge>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive === docType.id
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-300 bg-slate-50"
            }`}
            onDragEnter={(e) => handleDrag(e, docType.id)}
            onDragLeave={(e) => handleDrag(e, docType.id)}
            onDragOver={(e) => handleDrag(e, docType.id)}
            onDrop={(e) => handleDrop(e, docType.id)}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">
              Drag and drop files here, or{" "}
              <label className="text-emerald-600 cursor-pointer hover:text-emerald-700">
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
            <p className="text-sm text-slate-500">
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
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <File className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-1" />
                          <p className="text-xs text-slate-500 mt-1">
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
                      className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
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
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Terms & Conditions
        </h3>
        <p className="text-slate-600">
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
          <label htmlFor="terms" className="text-sm text-slate-700">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-emerald-600 hover:text-emerald-700"
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
          <label htmlFor="privacy" className="text-sm text-slate-700">
            I agree to the{" "}
            <Link
              href="/privacy"
              className="text-emerald-600 hover:text-emerald-700"
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
          <label htmlFor="compliance" className="text-sm text-slate-700">
            I certify that all information provided is accurate and that my
            business complies with all applicable insurance regulations and
            licensing requirements.
          </label>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h4 className="font-medium text-emerald-800">Verification Process</h4>
        </div>
        <p className="text-emerald-700 text-sm">
          Your application will undergo a comprehensive verification process
          including document review, license validation, and compliance checks.
          This typically takes 3-5 business days.
        </p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-800">What Happens Next?</h4>
        </div>
        <ul className="text-blue-700 text-sm space-y-1">
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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/auth/register"
            className="inline-flex items-center space-x-2 group mb-8"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 transition-colors" />
            <span className="text-slate-600 group-hover:text-emerald-600 transition-colors">
              Back to Registration
            </span>
          </Link>

          <div className="relative w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Building className="w-8 h-8 text-white" />
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-20 animate-pulse"
              style={{ transform: "scale(1.1)" }}
            ></div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Insurance Provider Registration
          </h1>
          <p className="text-slate-600">
            Join our network of trusted insurance providers
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Registration Form */}
        <Card className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl">
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
                    className="border-slate-300 text-white bg-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-400 transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
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
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ml-auto"
                >
                  {currentStep === 3 ? "Submit Application" : "Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
