"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, XCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import LeaveApplication from "@/components/leave-application"
import TaskView from "@/components/task-view"
import DateTimeDisplay from "@/components/date-time-display"
import SortFilterControls from "@/components/sort-filter-controls"
import { sortData, filterData } from "@/utils/date-utils"

// Simulated data
const leaveData = [
  {
    id: 1,
    type: "Sick Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    days: 3,
    status: "approved",
    appliedDate: "2024-01-10",
  },
  {
    id: 2,
    type: "Vacation",
    startDate: "2024-02-20",
    endDate: "2024-02-25",
    days: 6,
    status: "pending",
    appliedDate: "2024-02-15",
  },
  {
    id: 3,
    type: "Personal Leave",
    startDate: "2024-03-10",
    endDate: "2024-03-10",
    days: 1,
    status: "rejected",
    appliedDate: "2024-03-05",
  },
]

const leaveBalance = {
  "Sick Leave": { used: 3, total: 10 },
  Vacation: { used: 6, total: 20 },
  "Personal Leave": { used: 2, total: 5 },
}

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("appliedDate")
  const [filterBy, setFilterBy] = useState("all")
  const router = useRouter()

  const leaveSortOptions = [
    { value: "type", label: "Leave Type" },
    { value: "startDate", label: "Start Date" },
    { value: "appliedDate", label: "Applied Date" },
    { value: "days", label: "Duration" },
  ]

  const leaveFilterOptions = [
    { value: "all", label: "All Leaves" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ]

  const handleClearFilters = () => {
    setSearchTerm("")
    setFilterBy("all")
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (filterBy !== "all") count++
    return count
  }

  const getFilteredAndSortedLeaves = () => {
    const filtered = filterData(leaveData, searchTerm, filterBy, ["type", "status"])
    return sortData(filtered, sortBy)
  }

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!currentUser) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: "#00a7cf" }}
            >
              EMS
            </div>
            <h1 className="text-xl font-semibold">Employee Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <DateTimeDisplay />

        <div className="mt-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(leaveBalance).map(([type, balance]) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{balance.total - balance.used}</div>
                  <p className="text-xs text-gray-600">
                    {balance.used} used of {balance.total} days
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(balance.used / balance.total) * 100}%`,
                        backgroundColor: "#044f7c",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="leaves" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leaves">Leave Management</TabsTrigger>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="leaves" className="space-y-4">
            <SortFilterControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={leaveSortOptions}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              filterOptions={leaveFilterOptions}
              onClearFilters={handleClearFilters}
              activeFiltersCount={getActiveFiltersCount()}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeaveApplication />
              <Card>
                <CardHeader>
                  <CardTitle>Leave History</CardTitle>
                  <CardDescription>Your recent leave applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getFilteredAndSortedLeaves().map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{leave.type}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {leave.startDate} to {leave.endDate} ({leave.days} days)
                        </p>
                        <p className="text-xs text-gray-500">Applied: {leave.appliedDate}</p>
                      </div>
                      <Badge
                        variant={
                          leave.status === "approved"
                            ? "default"
                            : leave.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className={leave.status === "approved" ? "bg-green-100 text-green-800" : ""}
                      >
                        {leave.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {leave.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                        {leave.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskView userRole="user" currentUserId={currentUser.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
