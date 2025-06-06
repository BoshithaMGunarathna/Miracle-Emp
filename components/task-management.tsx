"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, User, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskTable from "./task-table"
import SortFilterControls from "./sort-filter-controls"
import { sortData, filterData, isThisWeek } from "@/utils/date-utils"

// Simulated data
const employees = [
  { id: 2, name: "John Doe" },
  { id: 3, name: "Jane Smith" },
  { id: 4, name: "Mike Johnson" },
]

const initialTasks = [
  {
    id: 1,
    title: "Update Employee Database",
    description: "Migrate employee records to new system",
    assignedTo: 2,
    assignedToName: "John Doe",
    startDate: "2024-01-15",
    deadline: "2024-01-30",
    status: "in-progress",
    comments: [{ id: 1, author: "Admin", text: "Please prioritize this task", date: "2024-01-16" }],
  },
  {
    id: 2,
    title: "Prepare Monthly Report",
    description: "Generate and review monthly performance report",
    assignedTo: 3,
    assignedToName: "Jane Smith",
    startDate: "2024-01-20",
    deadline: "2024-01-25",
    status: "pending",
    comments: [],
  },
]

export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    startDate: "",
    deadline: "",
  })
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

  const getFilteredAndSortedTasks = () => {
    const filtered = filterData(tasks, searchTerm, filterBy, ["title", "description", "assignedToName"])
    return sortData(filtered, sortBy)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    const assignedEmployee = employees.find((emp) => emp.id === Number.parseInt(newTask.assignedTo))

    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      assignedTo: Number.parseInt(newTask.assignedTo),
      assignedToName: assignedEmployee?.name || "",
      startDate: newTask.startDate,
      deadline: newTask.deadline,
      status: "pending" as const,
      comments: [],
    }

    setTasks([...tasks, task])
    setNewTask({ title: "", description: "", assignedTo: "", startDate: "", deadline: "" })
    setIsDialogOpen(false)
  }

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleAddComment = (taskId: number) => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: "Admin",
      text: newComment,
      date: new Date().toISOString().split("T")[0],
    }

    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, comments: [...task.comments, comment] } : task)))
    setNewComment("")
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

  const handleViewTaskDetails = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTaskId(task.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Task Management</h3>
          <p className="text-sm text-gray-600">Assign and track tasks for employees</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: "#044f7c" }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Assign a new task to an employee</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assign-to">Assign To</Label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" style={{ backgroundColor: "#044f7c" }}>
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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

      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <div className="grid gap-4">
            {getFilteredAndSortedTasks().map((task) => (
              <Card key={task.id} className={isThisWeek(task.deadline) ? "bg-yellow-50 border-yellow-200" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription className="mt-1">{task.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ").toUpperCase()}</Badge>
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <TaskTable
            tasks={getFilteredAndSortedTasks()}
            onViewDetails={handleViewTaskDetails}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
