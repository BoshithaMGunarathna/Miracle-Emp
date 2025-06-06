"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, MessageSquare, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskTable from "./task-table"
import SortFilterControls from "./sort-filter-controls"
import { sortData, filterData, isThisWeek } from "@/utils/date-utils"

// Simulated tasks data
const allTasks = [
  {
    id: 1,
    title: "Update Employee Database",
    description: "Migrate employee records to new system",
    assignedTo: 1,
    assignedToName: "Pasan Dulashith",
    startDate: "2024-01-15",
    deadline: "2024-01-30",
    status: "in-progress",
    comments: [
      {
        id: 1,
        author: "Admin",
        text: "Please prioritize this task",
        date: "2024-01-16"
      },
      {
        id: 2,
        author: "Pasan Dulashith",
        text: "Working on it, will complete by deadline",
        date: "2024-01-17"
      }
    ]
  },
  {
    id: 2,
    title: "Prepare Monthly Report",
    description: "Generate and review monthly performance report",
    assignedTo: 2,
    assignedToName: "Boshitha Gunarathna",
    startDate: "2024-01-20",
    deadline: "2024-01-25",
    status: "pending",
    comments: []
  },
  {
    id: 3,
    title: "System Maintenance",
    description: "Perform routine system maintenance and updates",
    assignedTo: 1,
    assignedToName: "Pasan Dulashith",
    startDate: "2024-01-10",
    deadline: "2024-01-15",
    status: "completed",
    comments: [
      {
        id: 3,
        author: "Pasan Dulashith",
        text: "Maintenance completed successfully",
        date: "2024-01-14"
      }
    ]
  }
];


interface TaskViewProps {
  userRole: "admin" | "user"
  currentUserId: number
}

export default function TaskView({ userRole, currentUserId }: TaskViewProps) {
  const [tasks, setTasks] = useState(allTasks)
  const [newComment, setNewComment] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("deadline")
  const [filterBy, setFilterBy] = useState("all")

  const taskSortOptions = [
    { value: "title", label: "Title" },
    { value: "assignedToName", label: "Assignee" },
    { value: "startDate", label: "Start Date" },
    { value: "deadline", label: "Deadline" },
    { value: "status", label: "Status" },
  ]

  const taskFilterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "this-week", label: "Due This Week" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
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

  const getFilteredAndSortedTasks = (taskList: typeof allTasks) => {
    const filtered = filterData(taskList, searchTerm, filterBy, ["title", "description", "assignedToName"])
    return sortData(filtered, sortBy)
  }

  const handleStatusChange = (taskId: number, newStatus: string) => {
    // Only allow users to update their own tasks
    const task = tasks.find((t) => t.id === taskId)
    if (userRole === "user" && task?.assignedTo !== currentUserId) return

    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleAddComment = (taskId: number) => {
    if (!newComment.trim()) return

    const task = tasks.find((t) => t.id === taskId)
    // Users can only comment on their own tasks
    if (userRole === "user" && task?.assignedTo !== currentUserId) return

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const comment = {
      id: Date.now(),
      author: currentUser.name || "User",
      text: newComment,
      date: new Date().toISOString().split("T")[0],
    }

    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, comments: [...task.comments, comment] } : task)))
    setNewComment("")
    setSelectedTaskId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const myTasks = userRole === "user" ? tasks.filter((task) => task.assignedTo === currentUserId) : []
  const otherTasks = userRole === "user" ? tasks.filter((task) => task.assignedTo !== currentUserId) : []

  const handleViewTaskDetails = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTaskId(task.id)
    }
  }

  return (
    <div className="space-y-6">
      <SortFilterControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={taskSortOptions}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        filterOptions={taskFilterOptions}
        onClearFilters={handleClearFilters}
        activeFiltersCount={getActiveFiltersCount()}
      />
      {userRole === "user" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                My Tasks
              </CardTitle>
              <CardDescription>Tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="cards" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="cards">Card View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>

                <TabsContent value="cards">
                  {myTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tasks assigned</p>
                  ) : (
                    getFilteredAndSortedTasks(myTasks).map((task) => (
                      <Card
                        key={task.id}
                        className={`border-l-4 ${isThisWeek(task.deadline) ? "bg-yellow-50 border-l-yellow-400" : ""}`}
                        style={{ borderLeftColor: isThisWeek(task.deadline) ? "#facc15" : "#044f7c" }}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <CardDescription className="mt-1">{task.description}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace("-", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>
                                {task.startDate} - {task.deadline}
                              </span>
                            </div>
                            <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">Comments ({task.comments.length})</span>
                            </div>

                            {task.comments.map((comment) => (
                              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">{comment.author}</span>
                                  <span className="text-xs text-gray-500">{comment.date}</span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                              </div>
                            ))}

                            <div className="flex space-x-2">
                              <Input
                                placeholder="Add a comment..."
                                value={selectedTaskId === task.id ? newComment : ""}
                                onChange={(e) => {
                                  setSelectedTaskId(task.id)
                                  setNewComment(e.target.value)
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(task.id)}
                                disabled={!newComment.trim() || selectedTaskId !== task.id}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="table">
                  {myTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tasks assigned</p>
                  ) : (
                    <TaskTable
                      tasks={myTasks}
                      onViewDetails={handleViewTaskDetails}
                      onStatusChange={handleStatusChange}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Tasks</CardTitle>
              <CardDescription>Tasks assigned to other team members (view only)</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cards" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="cards">Card View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>

                <TabsContent value="cards">
                  <div className="space-y-4">
                    {getFilteredAndSortedTasks(otherTasks).map((task) => (
                      <div
                        key={task.id}
                        className={`border rounded-lg p-4 ${isThisWeek(task.deadline) ? "bg-yellow-100 border-yellow-300" : "bg-gray-50"}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{task.assignedToName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{task.deadline}</span>
                            </div>
                          </div>
                          <span>{task.comments.length} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <TaskTable tasks={otherTasks} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {userRole === "admin" && (
        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid gap-4">
              {getFilteredAndSortedTasks(tasks).map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription className="mt-1">{task.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{task.assignedToName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>
                            {task.startDate} - {task.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Comments ({task.comments.length})</span>
                      </div>

                      {task.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      ))}

                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a comment..."
                          value={selectedTaskId === task.id ? newComment : ""}
                          onChange={(e) => {
                            setSelectedTaskId(task.id)
                            setNewComment(e.target.value)
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(task.id)}
                          disabled={!newComment.trim() || selectedTaskId !== task.id}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <TaskTable tasks={tasks} onViewDetails={handleViewTaskDetails} onStatusChange={handleStatusChange} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
