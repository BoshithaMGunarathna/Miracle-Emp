"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Simulated user data with leave balances
const initialUsers = [
  {
    id: 2,
    name: "John Doe",
    email: "john@company.com",
    role: "user",
    leaveBalance: {
      "Sick Leave": { used: 3, total: 10 },
      Vacation: { used: 6, total: 20 },
      "Personal Leave": { used: 2, total: 5 },
    },
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@company.com",
    role: "user",
    leaveBalance: {
      "Sick Leave": { used: 1, total: 10 },
      Vacation: { used: 8, total: 20 },
      "Personal Leave": { used: 0, total: 5 },
    },
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mike@company.com",
    role: "user",
    leaveBalance: {
      "Sick Leave": { used: 5, total: 10 },
      Vacation: { used: 12, total: 20 },
      "Personal Leave": { used: 3, total: 5 },
    },
  },
]

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [leaveAllowances, setLeaveAllowances] = useState({
    "Sick Leave": 10,
    Vacation: 20,
    "Personal Leave": 5,
  })

  const handleUpdateLeaveBalance = () => {
    if (!selectedUser) return

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            leaveBalance: {
              "Sick Leave": { used: user.leaveBalance["Sick Leave"].used, total: leaveAllowances["Sick Leave"] },
              Vacation: { used: user.leaveBalance["Vacation"].used, total: leaveAllowances["Vacation"] },
              "Personal Leave": {
                used: user.leaveBalance["Personal Leave"].used,
                total: leaveAllowances["Personal Leave"],
              },
            },
          }
        : user,
    )

    setUsers(updatedUsers)
    setIsDialogOpen(false)
    setSelectedUser(null)
  }

  const openEditDialog = (user: any) => {
    setSelectedUser(user)
    setLeaveAllowances({
      "Sick Leave": user.leaveBalance["Sick Leave"].total,
      Vacation: user.leaveBalance["Vacation"].total,
      "Personal Leave": user.leaveBalance["Personal Leave"].total,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">User Management</h3>
        <p className="text-sm text-gray-600">Manage employee leave allowances and view balances</p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Leave Balance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Leave Balance Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(user.leaveBalance).map(([type, balance]) => (
                    <div key={type} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{type}</span>
                        <Badge variant="outline">{balance.total - balance.used} left</Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {balance.used} used of {balance.total} days
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(balance.used / balance.total) * 100}%`,
                            backgroundColor: balance.used / balance.total > 0.8 ? "#ef4444" : "#044f7c",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Leave Allowances</DialogTitle>
            <DialogDescription>Update annual leave allowances for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(leaveAllowances).map(([type, allowance]) => (
              <div key={type} className="space-y-2">
                <Label htmlFor={type}>{type} (days per year)</Label>
                <Input
                  id={type}
                  type="number"
                  min="0"
                  value={allowance}
                  onChange={(e) =>
                    setLeaveAllowances({
                      ...leaveAllowances,
                      [type]: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            ))}
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleUpdateLeaveBalance} className="flex-1" style={{ backgroundColor: "#044f7c" }}>
                Update Allowances
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
