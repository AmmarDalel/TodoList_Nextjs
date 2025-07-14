"use client";

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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

/* ************************************************************************** */
/*                                 Types & Interfaces                        */
/* ************************************************************************** */
export type TaskModified = {
  id: string;
  title?: string;
  description?: string;
};

interface UpdateDialogProps {
  Task: TaskModified;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */
export default function UpdateDialog({
  open,
  onOpenChange,
  title = "Modification",
  description = "Êtes-vous sûr(e) de vouloir modifier cet élément ? ",
  Task,
}: UpdateDialogProps) {
  /* ************************************************************************** */
  /*                                   State                                   */
  /* ************************************************************************** */
  const [task, setTask] = useState<TaskModified>({
    id: Task?.id,
    title: Task?.title,
    description: Task?.description,
  });

  /* ************************************************************************** */
  /*                                  Hooks                                    */
  /* ************************************************************************** */
  const utils = api.useContext();

  // Met à jour l'état local task lorsque la prop Task change
  useEffect(() => {
    setTask(Task);
  }, [Task]);

  /* ************************************************************************** */
  /*                                Mutations                                  */
  /* ************************************************************************** */
  const updateMutation = api.tasks.update.useMutation({
    onMutate: async ({ id, title, description }) => {
      await utils.tasks.taskslist.cancel();
      const previousData = utils.tasks.taskslist.getData();

      // Mise à jour optimiste du cache des tâches
      utils.tasks.taskslist.setData(
        undefined,
        (old) =>
          old?.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...(title !== undefined ? { title } : {}),
                  ...(description !== undefined ? { description } : {}),
                }
              : task,
          ) ?? [],
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Restaure les données précédentes en cas d'erreur
      if (context?.previousData) {
        utils.tasks.taskslist.setData(undefined, context.previousData);
      }
      toast.error("Erreur lors de la modification de la tâche.", {
        style: {
          color: "red",
        },
      });
    },
    onSettled: async () => {
      // Invalide la requête pour refetch les données
      await utils.tasks.taskslist.invalidate();
    },
    onSuccess: async () => {
      toast.success("La tâche a été modifié avec succès !", {
        style: {
          color: "green",
        },
      });
    },
  });

  /* ************************************************************************** */
  /*                                  Handlers                                 */
  /* ************************************************************************** */
  const handleClick = () => {
    if (Task === task) return null;

    updateMutation.mutate({
      id: Task.id,
      title: task.title!,
      description: task.description!,
    });
  };

  /* ************************************************************************** */
  /*                                  Render                                   */
  /* ************************************************************************** */
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <Input
            type="text"
            value={task?.title ?? ""}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Titre de la tâche"
          />

          <Input
            type="text"
            value={task?.description ?? ""}
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
