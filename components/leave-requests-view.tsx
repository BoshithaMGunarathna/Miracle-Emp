"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Calendar, User } from "lucide-react"
import SortFilterControls from "./sort-filter-controls"
import { sortData, filterData } from "@/utils/date-utils"

// Simulated leave requests data
const leaveRequests = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeId: 2,
    type: "Sick Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Flu symptoms",
    status: "pending",
    appliedDate: "2024-01-18",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeId: 3,
    type: "Vacation",
    startDate: "2024-02-15",
    endDate: "2024-02-20",
    days: 6,
    reason: "Family vacation",
    status: "pending",
    appliedDate: "2024-02-10",
  },
  {
    id: 3,
    employeeName: "Mike Johnson",
    employeeId: 4,
    type: "Personal Leave",
    startDate: "2024-01-25",
    endDate: "2024-01-25",
    days: 1,
    reason: "Personal appointment",
    status: "approved",
    appliedDate: "2024-01-20",
  },
  {
    id: 4,
    employeeName: "Finance Manager",
    employeeId: 5,
    type: "Vacation",
    startDate: "2024-03-10",
    endDate: "2024-03-15",
    days: 6,
    reason: "Annual vacation",
    status: "pending",
    appliedDate: "2024-02-25",
  },
]

export default function LeaveRequestsView() {
  const [requests] = useState(leaveRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("appliedDate")
  const [filterBy, setFilterBy] = useState("all")

  const leaveSortOptions = [
    { value: "employeeName", label: "Employee Name" },
    { value: "type", label: "Leave Type" },
    { value: "startDate", label: "Start Date" },
    { value: "appliedDate", label: "Applied Date" },
    { value: "days", label: "Duration" },
  ]

  const leaveFilterOptions = [
    { value: "all", label: "All Requests" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Vacation", label: "Vacation" },
    { value: "Personal Leave", label: "Personal Leave" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
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

  const getFilteredAndSortedRequests = () => {
    const filtered = filterData(requests, searchTerm, filterBy, ["employeeName", "type", "reason", "status"])
    return sortData(filtered, sortBy)
  }

  const pendingRequests = getFilteredAndSortedRequests().filter((req) => req.status === "pending")
  const processedRequests = getFilteredAndSortedRequests().filter((req) => req.status !== "pending")

  return (
    <div className="space-y-6">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Pending Leave Requests
          </CardTitle>
          <CardDescription>View pending leave applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending requests</p>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{request.employeeName}</span>
                      <Badge variant="outline">{request.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {request.startDate} to {request.endDate}
                        </span>
                      </div>
                      <span>({request.days} days)</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                    <p className="text-xs text-gray-500">Applied: {request.appliedDate}</p>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Requests</CardTitle>
          <CardDescription>Previously processed leave requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {processedRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No processed requests</p>
          ) : (
            processedRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{request.employeeName}</span>
                    <span className="text-sm text-gray-600">- {request.type}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {request.startDate} to {request.endDate} ({request.days} days)
                  </p>
                </div>
                <Badge
                  variant={request.status === "approved" ? "default" : "destructive"}
                  className={request.status === "approved" ? "bg-green-100 text-green-800" : ""}
                >
                  {request.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {request.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
