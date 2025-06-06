"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, User } from "lucide-react"
import { isThisWeek } from "@/utils/date-utils"

interface Task {
  id: number
  title: string
  description: string
  assignedTo: number
  assignedToName: string
  startDate: string
  deadline: string
  status: string
  comments: Array<{ id: number; author: string; text: string; date: string }>
}

interface TaskTableProps {
  tasks: Task[]
  onViewDetails?: (taskId: number) => void
  onStatusChange?: (taskId: number, status: string) => void
}

export default function TaskTable({ tasks, onViewDetails, onStatusChange }: TaskTableProps) {
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className={isThisWeek(task.deadline) ? "bg-yellow-50 border-l-4 border-l-yellow-400" : ""}
            >
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{task.assignedToName}</span>
                </div>
              </TableCell>
              <TableCell>{task.startDate}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ").toUpperCase()}</Badge>
              </TableCell>
              <TableCell>{task.comments.length}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onViewDetails && (
                      <DropdownMenuItem onClick={() => onViewDetails(task.id)}>View details</DropdownMenuItem>
                    )}
                    {onStatusChange && (
                      <>
                        <DropdownMenuItem onClick={() => onStatusChange(task.id, "pending")}>
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")}>
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>
                          Mark as Completed
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
