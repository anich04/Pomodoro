"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function StatsPanel({ completedSessions }) {
  const [weeklyData, setWeeklyData] = useState([])
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)

  // Load stats from localStorage on component mount
  useEffect(() => {
    const loadStats = () => {
      const stats = JSON.parse(localStorage.getItem("pomodoroStats") || "{}")
      const today = new Date()

      // Generate data for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse()

      const data = last7Days.map((date) => {
        const sessions = stats[date] || 0
        return {
          date: formatDate(date),
          sessions,
        }
      })

      setWeeklyData(data)

      // Calculate totals
      const total = Object.values(stats).reduce((sum, val) => sum + Number(val), 0)
      setTotalSessions(total)
      setTotalMinutes(total * 25) // Assuming 25 min per session
    }

    loadStats()
  }, [completedSessions])

  // Format date as "Mon", "Tue", etc.
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  return (
    <div className="space-y-6 py-4 px-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-rose-500 to-purple-600"></div>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-3xl font-bold">{totalSessions}</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-rose-500 to-purple-600"></div>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Focus Time</p>
            <p className="text-3xl font-bold">{totalMinutes} min</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
        <Card className="p-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} sessions`, "Completed"]}
                  labelFormatter={(label) => `Day: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="sessions" radius={[4, 4, 0, 0]} fill="url(#colorGradient)" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(346, 77%, 49%)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(269, 80%, 40%)" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          <Card
            className={`border overflow-hidden transition-all ${totalSessions >= 1 ? "border-rose-500 shadow-md" : "border-muted opacity-50"}`}
          >
            <div
              className={`h-1 ${totalSessions >= 1 ? "bg-gradient-to-r from-rose-500 to-purple-600" : "bg-muted"}`}
            ></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">First Timer</p>
              <p className="text-xs text-muted-foreground">Complete 1 session</p>
            </CardContent>
          </Card>
          <Card
            className={`border overflow-hidden transition-all ${totalSessions >= 5 ? "border-rose-500 shadow-md" : "border-muted opacity-50"}`}
          >
            <div
              className={`h-1 ${totalSessions >= 5 ? "bg-gradient-to-r from-rose-500 to-purple-600" : "bg-muted"}`}
            ></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Getting Started</p>
              <p className="text-xs text-muted-foreground">Complete 5 sessions</p>
            </CardContent>
          </Card>
          <Card
            className={`border overflow-hidden transition-all ${totalSessions >= 25 ? "border-rose-500 shadow-md" : "border-muted opacity-50"}`}
          >
            <div
              className={`h-1 ${totalSessions >= 25 ? "bg-gradient-to-r from-rose-500 to-purple-600" : "bg-muted"}`}
            ></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Focus Master</p>
              <p className="text-xs text-muted-foreground">Complete 25 sessions</p>
            </CardContent>
          </Card>
          <Card
            className={`border overflow-hidden transition-all ${totalSessions >= 100 ? "border-rose-500 shadow-md" : "border-muted opacity-50"}`}
          >
            <div
              className={`h-1 ${totalSessions >= 100 ? "bg-gradient-to-r from-rose-500 to-purple-600" : "bg-muted"}`}
            ></div>
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium">Productivity Pro</p>
              <p className="text-xs text-muted-foreground">Complete 100 sessions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
