"use client";

import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Trash2, PenLine } from "lucide-react";

import { api } from "~/trpc/react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import UpdateDialog, { type TaskModified } from "./UpdateDialog";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  isDone: number;
  createdAt: Date;
  updatedAt: Date;
}
export default function TaskList() {
  const utils = api.useContext();
  const { data, error, isLoading } = api.tasks.taskslist.useQuery();

  const deleteMutation = api.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.taskslist.invalidate();
    },
  });

  const checkMutation = api.tasks.check.useMutation({
    onSuccess: async () => {
      await utils.tasks.taskslist.invalidate();
    },
  });

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToModified, setTaskToModified] = useState<TaskModified>();

  const handleDeleteConfirmed = () => {
    if (taskToDelete) {
      deleteMutation.mutate({ id: taskToDelete });
      setTaskToDelete(null);
    }
  };

  const handleToggle = (id: string, isDone: number) => {
    checkMutation.mutate({ id, isDone });
  };

  if (isLoading) return <div>Chargement des tâches...</div>;
  if (error) return <div>Erreur lors du chargement des tâches.</div>;

  return (
    <div>
      {data?.map((element) => (
        <div
          key={element.id}
          className={`flex items-center gap-3 rounded-lg border p-4 transition-all duration-200 ${
            element.isDone === 1
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Checkbox
            id={`task-${element.id}`}
            checked={element.isDone === 1}
            onCheckedChange={() =>
              handleToggle(element.id, Number(!element.isDone))
            }
            className="data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
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
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              {new Date(element.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTaskToDelete(element.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
              aria-label="Supprimer la tâche"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTaskToModified({
                  id: element.id,
                  title: element.title,
                  description: element.description!,
                })
              }
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
              aria-label="modifier la tâche"
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <ConfirmDeleteDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
      <UpdateDialog
        open={!!taskToModified}
        onOpenChange={(open) => !open && setTaskToModified(undefined)}
        onConfirm={handleDeleteConfirmed}
        Task={taskToModified!}
      />
    </div>
  );
}
