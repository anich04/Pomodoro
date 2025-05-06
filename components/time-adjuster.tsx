"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Clock, Plus, Minus } from "lucide-react"

export default function TimeAdjuster({ onClose, onSave, initialMinutes, timerMode }) {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [presets, setPresets] = useState([5, 10, 15, 25, 30, 45, 60])

  // Get title based on timer mode
  const getTitle = () => {
    switch (timerMode) {
      case "focus":
        return "Adjust Focus Time"
      case "shortBreak":
        return "Adjust Short Break"
      case "longBreak":
        return "Adjust Long Break"
      default:
        return "Adjust Timer"
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setMinutes(value)
    } else {
      setMinutes("")
    }
  }

  // Handle increment/decrement
  const adjustMinutes = (amount) => {
    const newValue = Math.max(1, (minutes || 0) + amount)
    setMinutes(newValue)
  }

  // Handle save
  const handleSave = () => {
    if (minutes && minutes > 0) {
      onSave(minutes)
    } else {
      onClose()
    }
  }

  // Handle preset selection
  const selectPreset = (preset) => {
    setMinutes(preset)
  }

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "Enter") {
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [minutes])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {getTitle()}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-6">
          <Label htmlFor="minutes" className="text-sm font-medium mb-2 block">
            Enter time in minutes:
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustMinutes(-1)}
              disabled={minutes <= 1}
              className="rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="minutes"
              type="number"
              min="1"
              value={minutes}
              onChange={handleInputChange}
              className="text-center text-xl font-bold"
            />
            <Button variant="outline" size="icon" onClick={() => adjustMinutes(1)} className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Quick presets:</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => selectPreset(preset)}
                className={`rounded-full ${minutes === preset ? "border-rose-500 bg-rose-500/10 text-rose-500" : ""}`}
              >
                {preset} min
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
