import { ArrowRight, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface IGetStartedButtonProps {
  text?: string;
  className?: string;
  loading?: boolean;
}

export default function GetStartedButton({
  text = "Get started",
  className,
  loading = false,
}: IGetStartedButtonProps) {
  return (
    <div className="min-h-12 w-full">
      <button
        disabled={loading}
        className={cn(
          "group flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-emerald-100 p-2 font-bold transition-colors duration-100 ease-in-out hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70",
          className
        )}
      >
        {loading ? (
          <>
            <span className="text-emerald-700">Loading...</span>
            <Loader className="animate-spin text-emerald-700" size={20} />
          </>
        ) : (
          <>
            <span className="text-emerald-700 transition-colors duration-100 ease-in-out group-hover:text-emerald-100">
              {text}
            </span>
            <div
              className={cn(
                "relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full transition-transform duration-100",
                "bg-emerald-600 group-hover:bg-emerald-100"
              )}
            >
              <div className="absolute left-0 flex h-7 w-14 -translate-x-1/2 items-center justify-center transition-all duration-200 ease-in-out group-hover:translate-x-0">
                <ArrowRight
                  size={32}
                  className={cn(
                    "size-7 transform p-1 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  )}
                />
                <ArrowRight
                  size={32}
                  className={cn(
                    "size-7 transform p-1 text-emerald-100 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                  )}
                />
              </div>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
