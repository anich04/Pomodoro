import PomodoroTimer from "@/components/pomodoro-timer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/50">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-rose-500 to-purple-600 text-transparent bg-clip-text">
          Pomodoro Focus
        </h1>
        <p className="text-center text-muted-foreground mb-8">Stay productive, one timer at a time</p>
        <PomodoroTimer />
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Made with ❤️ for focused productivity</p>
      </footer>
      <Toaster />
    </main>
  )
}
