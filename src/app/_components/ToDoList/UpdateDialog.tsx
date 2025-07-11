"use client";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

interface UpdateDialogProps {
  Task: TaskModified;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export type TaskModified = {
  id: string;
  title?: string;
  description?: string;
};

function UpdateDialog({
  open,
  onOpenChange,
  title = "Modification",
  description = "Êtes-vous sûr(e) de vouloir modifier cet élément ? ",
  Task,
}: UpdateDialogProps) {
  const [task, setTask] = useState<TaskModified>({
    id: Task?.id,
    title: Task?.title,
    description: Task?.description,
  });

  const utils = api.useContext();
  useEffect(() => {
    setTask(Task);
  }, [Task]);

  const updatekMutation = api.tasks.update.useMutation({
    onSuccess: async () => {
      await utils.tasks.taskslist.invalidate();
    },
  });

  const handleClick = () => {
    if (Task == task) return null;
    updatekMutation.mutate({
      id: Task.id,
      title: task.title!,
      description: task.description!,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <Input
            type="text"
            value={task?.title}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Titre de la tâche"
          />
          <Input
            type="text"
            value={task?.description}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description de la tâche"
          />
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-4 pt-4">
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="btn"
          >
            Non
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleClick();
              onOpenChange(false);
            }}
            className="btn btn-danger"
          >
            Oui, modifier
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateDialog;
