"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function FocusOverlay({ onClose }) {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="text-center p-6 max-w-md">
        {showContent ? (
          <div className="space-y-6 text-white animate-fadeIn">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
              <div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
              Focus Mode Active
            </h2>
            <p className="text-white/80 text-lg">
              Stay focused on your current task. The timer is still running in the background.
            </p>
            <p className="text-white/60 text-sm">You can exit focus mode by clicking the X in the top right corner.</p>
            <Button
              variant="outline"
              onClick={() => setShowContent(false)}
              className="mt-4 border-white/20 text-white hover:bg-white/10 rounded-full px-6"
            >
              Hide Message
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowContent(true)}
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full px-6"
          >
            Show Focus Message
          </Button>
        )}
      </div>
    </div>
  )
}
