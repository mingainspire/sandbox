import React from 'react';
import { Brain } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <Brain className="w-16 h-16 text-blue-400 animate-pulse" />
          <div className="absolute -inset-4">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white">System Initializing</h2>
        <p className="text-gray-400">Loading components and configurations...</p>
        <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
}
