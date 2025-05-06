import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SettingsPanel from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your Pomodoro timer and app preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsPanel
            settings={{
              focusDuration: 25,
              shortBreakDuration: 5,
              longBreakDuration: 15,
              sessionsBeforeLongBreak: 4,
              autoStartBreaks: true,
              autoStartPomodoros: false,
              enableSounds: true,
              enableSpotify: false,
              enableFocusMode: false,
            }}
            onSettingsChange={(settings) => console.log(settings)}
          />
        </CardContent>
      </Card>
    </main>
  )
}
