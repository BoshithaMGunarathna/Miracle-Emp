"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"

export default function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="flex items-center justify-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-blue-600" />
        <span className="text-lg font-medium text-gray-800">{formatDate(currentDateTime)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-600" />
        <span className="text-lg font-mono font-medium text-gray-800">{formatTime(currentDateTime)}</span>
      </div>
    </div>
  )
}
