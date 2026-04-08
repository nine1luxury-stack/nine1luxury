import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorMessage({ title = "حدث خطأ", message, onRetry, className }: ErrorMessageProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center space-y-4 border border-dashed border-red-500/20 rounded-sm p-8", className)}>
            <AlertCircle className="w-12 h-12 text-red-500/50" />
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-gray-400">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-gold-500 text-rich-black px-6 py-2 font-bold uppercase tracking-widest hover:bg-gold-300 transition-colors rounded-sm"
                >
                    إعادة المحاولة
                </button>
            )}
        </div>
    );
}
