import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
            <Loader2 className={cn("text-gold-500 animate-spin", sizeClasses[size])} />
            {text && <p className="text-gold-300 font-medium">{text}</p>}
        </div>
    );
}
