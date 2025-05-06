"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Play,
  Pause,
  SkipForward,
  Settings,
  Music,
  BarChart3,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Coffee,
  Clock,
  Plus,
  Minus,
  Edit2,
} from "lucide-react"
import SpotifyIntegration from "@/components/spotify-integration"
import SettingsPanel from "@/components/settings-panel"
import StatsPanel from "@/components/stats-panel"
import FocusOverlay from "@/components/focus-overlay"
import TimeAdjuster from "@/components/time-adjuster"
import { cn } from "@/lib/utils"

// Timer modes
const TIMER_MODES = {
  FOCUS: "focus",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
}

export default function PomodoroTimer() {
  // Timer state
  const [activeTab, setActiveTab] = useState("timer")
  const [timerMode, setTimerMode] = useState(TIMER_MODES.FOCUS)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showFocusOverlay, setShowFocusOverlay] = useState(false)
  const [showTimeAdjuster, setShowTimeAdjuster] = useState(false)
  const [initialTime, setInitialTime] = useState(25 * 60) // Store the initial time for progress calculation

  // Settings (customizable)
  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    enableSounds: true,
    enableSpotify: false,
    enableFocusMode: false,
  })

  const { toast } = useToast()
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  // Initialize timer based on mode
  useEffect(() => {
    let newTimeLeft = 0
    switch (timerMode) {
      case TIMER_MODES.FOCUS:
        newTimeLeft = settings.focusDuration * 60
        break
      case TIMER_MODES.SHORT_BREAK:
        newTimeLeft = settings.shortBreakDuration * 60
        break
      case TIMER_MODES.LONG_BREAK:
        newTimeLeft = settings.longBreakDuration * 60
        break
    }
    setTimeLeft(newTimeLeft)
    setInitialTime(newTimeLeft)
    setProgress(0)
  }, [timerMode, settings])

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      const progressValue = 100 - (timeLeft / initialTime) * 100
      setProgress(progressValue)

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current)
            handleTimerComplete()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRunning, timeLeft, initialTime])

  // Handle timer completion
  const handleTimerComplete = () => {
    playSound()

    if (timerMode === TIMER_MODES.FOCUS) {
      // Increment completed sessions
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)

      // Save to local storage for stats
      saveSessionToStorage()

      // Determine next break type
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        setTimerMode(TIMER_MODES.LONG_BREAK)
        toast({
          title: "Long Break Time!",
          description: "Great job! Take a 15-minute break to recharge.",
        })
      } else {
        setTimerMode(TIMER_MODES.SHORT_BREAK)
        toast({
          title: "Short Break Time!",
          description: "Good work! Take a 5-minute break.",
        })
      }

      // Auto start break if enabled
      setIsRunning(settings.autoStartBreaks)
    } else {
      // Break completed, back to focus mode
      setTimerMode(TIMER_MODES.FOCUS)
      toast({
        title: "Focus Time!",
        description: "Break complete. Time to focus!",
      })

      // Auto start pomodoro if enabled
      setIsRunning(settings.autoStartPomodoros)
    }
  }

  // Get total time based on current mode
  const getTotalTime = () => {
    switch (timerMode) {
      case TIMER_MODES.FOCUS:
        return settings.focusDuration * 60
      case TIMER_MODES.SHORT_BREAK:
        return settings.shortBreakDuration * 60
      case TIMER_MODES.LONG_BREAK:
        return settings.longBreakDuration * 60
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Play notification sound
  const playSound = () => {
    if (settings.enableSounds && !isMuted) {
      // In a real app, we would have actual sound files
      console.log("Playing notification sound")
      // audioRef.current.play()
    }
  }

  // Save session data for statistics
  const saveSessionToStorage = () => {
    const today = new Date().toISOString().split("T")[0]
    const stats = JSON.parse(localStorage.getItem("pomodoroStats") || "{}")

    if (!stats[today]) {
      stats[today] = 0
    }

    stats[today] += 1
    localStorage.setItem("pomodoroStats", JSON.stringify(stats))
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Toggle focus overlay
  const toggleFocusOverlay = () => {
    setShowFocusOverlay(!showFocusOverlay)
  }

  // Adjust time functions
  const adjustTime = (minutes) => {
    if (isRunning) return // Don't adjust while timer is running

    const newTimeInSeconds = Math.max(60, timeLeft + minutes * 60) // Minimum 1 minute
    setTimeLeft(newTimeInSeconds)
    setInitialTime(newTimeInSeconds)

    // Update the corresponding setting
    const newSettings = { ...settings }
    switch (timerMode) {
      case TIMER_MODES.FOCUS:
        newSettings.focusDuration = Math.floor(newTimeInSeconds / 60)
        break
      case TIMER_MODES.SHORT_BREAK:
        newSettings.shortBreakDuration = Math.floor(newTimeInSeconds / 60)
        break
      case TIMER_MODES.LONG_BREAK:
        newSettings.longBreakDuration = Math.floor(newTimeInSeconds / 60)
        break
    }
    setSettings(newSettings)

    // Save to localStorage
    localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings))
  }

  // Set custom time from the time adjuster
  const setCustomTime = (minutes) => {
    const newTimeInSeconds = minutes * 60
    setTimeLeft(newTimeInSeconds)
    setInitialTime(newTimeInSeconds)
    setShowTimeAdjuster(false)

    // Update the corresponding setting
    const newSettings = { ...settings }
    switch (timerMode) {
      case TIMER_MODES.FOCUS:
        newSettings.focusDuration = minutes
        break
      case TIMER_MODES.SHORT_BREAK:
        newSettings.shortBreakDuration = minutes
        break
      case TIMER_MODES.LONG_BREAK:
        newSettings.longBreakDuration = minutes
        break
    }
    setSettings(newSettings)

    // Save to localStorage
    localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings))

    toast({
      title: "Timer Updated",
      description: `Timer set to ${minutes} minutes.`,
    })
  }

  return (
    <>
      <Card className="shadow-xl border-0 rounded-xl overflow-hidden bg-gradient-to-br from-background to-background/90 backdrop-blur-sm">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 p-1 m-2 bg-muted/50 rounded-lg">
              <TabsTrigger
                value="timer"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-slate-800"
              >
                <Clock className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Timer</span>
              </TabsTrigger>
              <TabsTrigger
                value="spotify"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-slate-800"
              >
                <Music className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Music</span>
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-slate-800"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-slate-800"
              >
                <Settings className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timer" className="mt-0">
              <div className="flex justify-center mb-4 p-2">
                <div className="flex space-x-2">
                  <Button
                    variant={timerMode === TIMER_MODES.FOCUS ? "default" : "outline"}
                    onClick={() => setTimerMode(TIMER_MODES.FOCUS)}
                    className={cn(
                      "w-24 transition-all",
                      timerMode === TIMER_MODES.FOCUS &&
                        "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg",
                    )}
                  >
                    Focus
                  </Button>
                  <Button
                    variant={timerMode === TIMER_MODES.SHORT_BREAK ? "default" : "outline"}
                    onClick={() => setTimerMode(TIMER_MODES.SHORT_BREAK)}
                    className={cn(
                      "w-24 transition-all",
                      timerMode === TIMER_MODES.SHORT_BREAK &&
                        "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg",
                    )}
                  >
                    Short Break
                  </Button>
                  <Button
                    variant={timerMode === TIMER_MODES.LONG_BREAK ? "default" : "outline"}
                    onClick={() => setTimerMode(TIMER_MODES.LONG_BREAK)}
                    className={cn(
                      "w-24 transition-all",
                      timerMode === TIMER_MODES.LONG_BREAK &&
                        "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg",
                    )}
                  >
                    Long Break
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-6 px-4">
                <div className="relative mb-8">
                  <div className="w-64 h-64 rounded-full flex items-center justify-center bg-muted/30 border-8 border-muted/20 shadow-inner">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray="289.02652413026095"
                        strokeDashoffset={289.02652413026095 * (1 - progress / 100)}
                        className={cn(
                          "transition-all duration-1000 ease-linear",
                          timerMode === TIMER_MODES.FOCUS
                            ? "text-rose-500"
                            : timerMode === TIMER_MODES.SHORT_BREAK
                              ? "text-emerald-500"
                              : "text-blue-500",
                        )}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="text-7xl font-bold tabular-nums z-10">{formatTime(timeLeft)}</div>

                    {/* Time adjustment button */}
                    {!isRunning && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background shadow-md"
                        onClick={() => setShowTimeAdjuster(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-background px-4 py-1 rounded-full shadow-md border border-muted">
                    <div className="text-sm font-medium text-muted-foreground">
                      {timerMode === TIMER_MODES.FOCUS
                        ? "Focus Time"
                        : timerMode === TIMER_MODES.SHORT_BREAK
                          ? "Short Break"
                          : "Long Break"}
                    </div>
                  </div>
                </div>

                {/* Quick time adjustment buttons */}
                {!isRunning && (
                  <div className="flex justify-center space-x-3 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => adjustTime(-5)}
                      disabled={timeLeft <= 5 * 60}
                    >
                      <Minus className="h-4 w-4 mr-1" /> 5m
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => adjustTime(-1)}
                      disabled={timeLeft <= 60}
                    >
                      <Minus className="h-4 w-4 mr-1" /> 1m
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => adjustTime(1)}>
                      <Plus className="h-4 w-4 mr-1" /> 1m
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => adjustTime(5)}>
                      <Plus className="h-4 w-4 mr-1" /> 5m
                    </Button>
                  </div>
                )}

                <div className="flex space-x-3 mb-6">
                  <Button
                    size="lg"
                    onClick={() => setIsRunning(!isRunning)}
                    className={cn(
                      "w-32 transition-all shadow-md hover:shadow-lg",
                      isRunning
                        ? "bg-amber-500 hover:bg-amber-600"
                        : timerMode === TIMER_MODES.FOCUS
                          ? "bg-gradient-to-r from-rose-500 to-purple-600"
                          : timerMode === TIMER_MODES.SHORT_BREAK
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600",
                    )}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" /> Start
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      clearInterval(timerRef.current)
                      setIsRunning(false)
                      switch (timerMode) {
                        case TIMER_MODES.FOCUS:
                          setTimeLeft(settings.focusDuration * 60)
                          break
                        case TIMER_MODES.SHORT_BREAK:
                          setTimeLeft(settings.shortBreakDuration * 60)
                          break
                        case TIMER_MODES.LONG_BREAK:
                          setTimeLeft(settings.longBreakDuration * 60)
                          break
                      }
                      setProgress(0)
                    }}
                    className="rounded-full h-10 w-10 shadow-md hover:shadow-lg"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full h-10 w-10 shadow-md hover:shadow-lg"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="rounded-full h-10 w-10 shadow-md hover:shadow-lg"
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-3 rounded-full transition-all",
                          i < completedSessions % settings.sessionsBeforeLongBreak ||
                            (i === 0 &&
                              completedSessions % settings.sessionsBeforeLongBreak === 0 &&
                              completedSessions > 0)
                            ? "bg-rose-500 scale-110"
                            : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground flex items-center justify-center gap-2">
                    <Coffee className="h-4 w-4" />
                    <span>
                      Completed today: <strong>{completedSessions}</strong> pomodoros
                    </span>
                  </p>
                  {settings.enableFocusMode && (
                    <Button variant="link" onClick={toggleFocusOverlay} className="mt-2">
                      {showFocusOverlay ? "Disable" : "Enable"} Focus Mode
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spotify" className="mt-0">
              <SpotifyIntegration isEnabled={settings.enableSpotify} isRunning={isRunning} timerMode={timerMode} />
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <StatsPanel completedSessions={completedSessions} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsPanel settings={settings} onSettingsChange={setSettings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showFocusOverlay && <FocusOverlay onClose={toggleFocusOverlay} />}

      {/* Time Adjuster Modal */}
      {showTimeAdjuster && (
        <TimeAdjuster
          onClose={() => setShowTimeAdjuster(false)}
          onSave={setCustomTime}
          initialMinutes={Math.floor(timeLeft / 60)}
          timerMode={timerMode}
        />
      )}

      {/* Audio element for notification sounds */}
      <audio ref={audioRef} className="hidden">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}
