"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, LogOut, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import LeaveRequestsView from "@/components/leave-requests-view"
import LeaveApplication from "@/components/leave-application"
import TaskView from "@/components/task-view"
import DateTimeDisplay from "@/components/date-time-display"

// Simulated data
const dashboardStats = {
  pendingLeaves: 8,
  approvedLeaves: 15,
  rejectedLeaves: 3,
  assignedTasks: 5,
}

const leaveBalance = {
  "Sick Leave": { used: 2, total: 10 },
  Vacation: { used: 5, total: 20 },
  "Personal Leave": { used: 1, total: 5 },
}

export default function FinanceDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role !== "finance") {
        router.push(userData.role === "admin" ? "/admin" : "/dashboard")
        return
      }
      setCurrentUser(userData)
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
            <h1 className="text-xl font-semibold">Finance Dashboard</h1>
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
          <h2 className="text-2xl font-bold mb-4">Finance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Leaves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{dashboardStats.pendingLeaves}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approved Leaves
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dashboardStats.approvedLeaves}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Assigned Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.assignedTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  My Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {leaveBalance["Vacation"].total - leaveBalance["Vacation"].used}
                </div>
                <p className="text-xs text-gray-600">Vacation days remaining</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="all-leaves" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-leaves">All Leave Requests</TabsTrigger>
            <TabsTrigger value="my-leaves">My Leave Requests</TabsTrigger>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="all-leaves">
            <LeaveRequestsView />
          </TabsContent>

          <TabsContent value="my-leaves" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeaveApplication />
              <Card>
                <CardHeader>
                  <CardTitle>My Leave Balance</CardTitle>
                  <CardDescription>Your current leave allowances</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(leaveBalance).map(([type, balance]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{type}</span>
                        <span className="text-sm">
                          {balance.total - balance.used} / {balance.total} days
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(balance.used / balance.total) * 100}%`,
                            backgroundColor: "#044f7c",
                          }}
                        />
                      </div>
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
