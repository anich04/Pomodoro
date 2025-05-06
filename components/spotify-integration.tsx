"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogIn, Music, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SpotifyIntegration({ isEnabled, isRunning, timerMode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const { toast } = useToast()

  // Mock data for demonstration
  const mockPlaylists = [
    { id: 1, name: "Focus Flow", tracks: 25, image: "/placeholder.svg?height=60&width=60" },
    { id: 2, name: "Deep Work", tracks: 18, image: "/placeholder.svg?height=60&width=60" },
    { id: 3, name: "Productivity Boost", tracks: 32, image: "/placeholder.svg?height=60&width=60" },
    { id: 4, name: "Ambient Focus", tracks: 15, image: "/placeholder.svg?height=60&width=60" },
  ]

  const mockCurrentTrack = {
    name: "Deep Focus",
    artist: "Ambient Sounds",
    album: "Productivity Mix",
    image: "/placeholder.svg?height=60&width=60",
    duration: 241, // seconds
    progress: 75, // seconds
  }

  // Simulate connecting to Spotify
  const connectToSpotify = () => {
    // In a real app, this would redirect to Spotify OAuth
    toast({
      title: "Connecting to Spotify",
      description: "Redirecting to Spotify authorization...",
    })

    // Simulate successful connection after 1 second
    setTimeout(() => {
      setIsConnected(true)
      setPlaylists(mockPlaylists)
      toast({
        title: "Connected to Spotify",
        description: "Successfully connected to your Spotify account.",
      })
    }, 1000)
  }

  // Simulate playing a playlist
  const playPlaylist = (playlist) => {
    setSelectedPlaylist(playlist)
    setCurrentTrack(mockCurrentTrack)
    setIsPlaying(true)

    toast({
      title: "Now Playing",
      description: `Playing playlist: ${playlist.name}`,
    })
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Effect to handle auto play/pause based on timer state
  useEffect(() => {
    if (!isEnabled || !isConnected || !selectedPlaylist) return

    if (timerMode === "focus" && isRunning && !isPlaying) {
      setIsPlaying(true)
    } else if (timerMode !== "focus" && isPlaying) {
      setIsPlaying(false)
    }
  }, [isRunning, timerMode, isEnabled, isConnected, selectedPlaylist])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Music className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Spotify Integration</h3>
        <p className="text-muted-foreground mb-4 max-w-xs">
          Spotify integration is currently disabled. Enable it in settings to connect your account and play music during
          focus sessions.
        </p>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "#settings")}
          className="border-rose-500 text-rose-500 hover:bg-rose-500/10"
        >
          Go to Settings
        </Button>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Music className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Connect to Spotify</h3>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Connect your Spotify account to play music during your focus sessions.
        </p>
        <Button onClick={connectToSpotify} className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white">
          <LogIn className="mr-2 h-4 w-4" /> Connect Spotify
        </Button>
      </div>
    )
  }

  return (
    <div className="py-4 px-4">
      {currentTrack ? (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 shadow-md">
              <img
                src={currentTrack.image || "/placeholder.svg"}
                alt={currentTrack.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div>
              <h3 className="font-medium">{currentTrack.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              <p className="text-xs text-muted-foreground">{currentTrack.album}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-purple-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(currentTrack.progress / currentTrack.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTrack.progress)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 shadow-sm">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 shadow-sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlayPause}
              className="rounded-full h-10 w-10 bg-gradient-to-r from-rose-500 to-purple-600 shadow-md"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 shadow-sm">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 shadow-sm">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your playlists..."
            className="pl-8 bg-muted/50 border-muted focus-visible:ring-rose-500"
          />
        </div>
      </div>

      <h3 className="font-medium mb-2">Your Playlists</h3>
      <div className="grid gap-2">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedPlaylist?.id === playlist.id ? "border-rose-500 shadow-md" : ""
            }`}
            onClick={() => playPlaylist(playlist)}
          >
            <CardContent className="p-3 flex items-center">
              <div className="w-10 h-10 rounded overflow-hidden mr-3 shadow-sm">
                <img
                  src={playlist.image || "/placeholder.svg"}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{playlist.name}</h4>
                <p className="text-xs text-muted-foreground">{playlist.tracks} tracks</p>
              </div>
              {selectedPlaylist?.id === playlist.id && isPlaying && (
                <div className="ml-auto">
                  <div className="flex space-x-1 items-end h-5">
                    <div className="w-1 h-3 bg-rose-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                    <div className="w-1 h-5 bg-purple-600 rounded-full animate-[pulse_1.3s_ease-in-out_infinite]" />
                    <div className="w-1 h-2 bg-rose-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
