import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-400" />,
  error: <AlertCircle className="h-5 w-5 text-red-400" />,
  info: <Info className="h-5 w-5 text-blue-400" />,
};

export const TOAST_BG: Record<string, string> = {
  success: 'bg-gray-900 border-green-500/30',
  error: 'bg-gray-900 border-red-500/30',
  info: 'bg-gray-900 border-blue-500/30',
};