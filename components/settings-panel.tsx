"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react"

// Form schema with validation
const formSchema = z.object({
  focusDuration: z.coerce.number().min(1).max(120),
  shortBreakDuration: z.coerce.number().min(1).max(30),
  longBreakDuration: z.coerce.number().min(5).max(60),
  sessionsBeforeLongBreak: z.coerce.number().min(1).max(10),
  autoStartBreaks: z.boolean(),
  autoStartPomodoros: z.boolean(),
  enableSounds: z.boolean(),
  enableSpotify: z.boolean(),
  enableFocusMode: z.boolean(),
})

export default function SettingsPanel({ settings, onSettingsChange }) {
  const { toast } = useToast()

  // Initialize form with current settings
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  })

  // Update form when settings change
  useEffect(() => {
    form.reset(settings)
  }, [settings, form])

  // Handle form submission
  const onSubmit = (data) => {
    onSettingsChange(data)

    // Save to localStorage
    localStorage.setItem("pomodoroSettings", JSON.stringify(data))

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-rose-500 rounded-full"></div>
            <h3 className="text-lg font-medium">Timer Settings</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="focusDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-muted/50 focus-visible:ring-rose-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortBreakDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Break Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-muted/50 focus-visible:ring-rose-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="longBreakDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Break Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-muted/50 focus-visible:ring-rose-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionsBeforeLongBreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sessions Before Long Break</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-muted/50 focus-visible:ring-rose-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-purple-600 rounded-full"></div>
            <h3 className="text-lg font-medium">Behavior</h3>
          </div>

          <FormField
            control={form.control}
            name="autoStartBreaks"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto-start Breaks</FormLabel>
                  <FormDescription>Automatically start breaks when a focus session ends</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-rose-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoStartPomodoros"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto-start Focus Sessions</FormLabel>
                  <FormDescription>Automatically start focus sessions when a break ends</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-rose-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enableSounds"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Sounds</FormLabel>
                  <FormDescription>Play notification sounds when sessions end</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-rose-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-rose-500 rounded-full"></div>
            <h3 className="text-lg font-medium">Integrations</h3>
          </div>

          <FormField
            control={form.control}
            name="enableSpotify"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Spotify Integration</FormLabel>
                  <FormDescription>Connect to Spotify to play music during focus sessions</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-rose-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enableFocusMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Focus Mode</FormLabel>
                  <FormDescription>Display a fullscreen overlay to prevent distractions</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-rose-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
        >
          Save Settings
        </Button>
      </form>
    </Form>
  )
}
