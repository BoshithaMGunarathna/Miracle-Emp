"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Sun, Moon, Cloud, CloudRain, CloudSun, CloudLightning } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

const weatherIcons = {
  sunny: <CloudSun className="h-5 w-5 text-yellow-500" />,
  rainy: <CloudRain className="h-5 w-5 text-blue-400" />,
  cloudy: <Cloud className="h-5 w-5 text-gray-400" />,
  stormy: <CloudLightning className="h-5 w-5 text-purple-500" />,
}

export default function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day")
  const [weather, setWeather] = useState<keyof typeof weatherIcons>("sunny")
  const { theme } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentDateTime(now)
      setTimeOfDay(now.getHours() >= 6 && now.getHours() < 18 ? "day" : "night")
    }, 1000)

    // Simulate weather changes (in a real app, you'd fetch this)
    const weatherTimer = setInterval(() => {
      const weatherTypes = Object.keys(weatherIcons) as (keyof typeof weatherIcons)[]
      const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]
      setWeather(randomWeather)
    }, 30000)

    return () => {
      clearInterval(timer)
      clearInterval(weatherTimer)
    }
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
      hour12: false,
    })
  }

  const getDayProgress = () => {
    const hours = currentDateTime.getHours()
    const minutes = currentDateTime.getMinutes()
    return ((hours * 60 + minutes) / (18 * 60)) * 100
  }

  return (
    <div className={`relative p-6 rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-primaryStart to-primaryEnd'}`}>

      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-color2 "
          animate={{
            width: `${getDayProgress()}%`,
          }}
          transition={{
            duration: 1,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-sm`}
            >
              <Calendar className="h-6 w-6 text-blue-500" />
            </motion.div>
            <div>
              <motion.p 
                className="text-sm font-medium text-white"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                key={`date-${currentDateTime.getDate()}`}
              >
                {formatDate(currentDateTime)}
              </motion.p>
              <motion.h2 
                className="text-2xl font-bold text-white dark:text-white"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={`time-${currentDateTime.getSeconds()}`}
              >
                {formatTime(currentDateTime)}
              </motion.h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {timeOfDay === "day" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-300" />
              )}
              <span className="font-medium text-white dark:text-gray-300">
                {timeOfDay === "day" ? "Daytime" : "Nighttime"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {weatherIcons[weather]}
              <span className="font-medium text-white dark:text-gray-300 capitalize">
                {weather}
              </span>
            </div>
          </div>
        </div>

        {/* Additional time info */}
        <div className="mt-6 flex items-center justify-between text-sm text-white dark:text-gray-400">
          <div>
            <span>Day progress: {Math.round(getDayProgress())}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Week {Math.ceil(currentDateTime.getDate() / 7)}</span>
            <span>•</span>
            <span>Q{Math.floor((currentDateTime.getMonth() + 3) / 3)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}