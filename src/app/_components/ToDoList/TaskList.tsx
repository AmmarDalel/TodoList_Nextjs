"use client"

import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import { Trash2 } from "lucide-react"
import { api } from "~/trpc/react"

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  isDone: number
  createdAt: Date
  updatedAt: Date
}



export default function TaskList() {
  const utils = api.useContext(); 
  const { data, error, isLoading } = api.tasks.taskslist.useQuery()

  const deleteMutation = api.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.taskslist.invalidate()
    },
  })

  const checkMutation = api.tasks.check.useMutation({
    onSuccess: async () => {
      await utils.tasks.taskslist.invalidate()
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id })
  }

  const handleToggle = (id: string, isDone: number) => {
    checkMutation.mutate({ id, isDone })
  }

  if (isLoading) return <div>Chargement des tâches...</div>
  if (error) return <div>Erreur lors du chargement des tâches.</div>

  return (
    <div>
      {data?.map((element) => (
        <div
          key={element.id}
          className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
            element.isDone === 1
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <Checkbox
            id={`task-${element.id}`}
            checked={element.isDone === 1}
            onCheckedChange={() => handleToggle(element.id , Number(!element.isDone))}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          <label
            htmlFor={`task-${element.id}`}
            className={`flex-1 cursor-pointer transition-all duration-200 ${
              element.isDone === 1
                ? "text-green-700 line-through opacity-75"
                : "text-gray-800"
            }`}
          >
            <strong>{element.title}</strong> — {element.description}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {new Date(element.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(element.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              aria-label="Supprimer la tâche"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
