"use client";

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Trash2, PenLine } from "lucide-react";
import { api } from "~/trpc/react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import UpdateDialog, { type TaskModified } from "./UpdateDialog";
import { toast } from "sonner";

/* ************************************************************************** */
/*                                   Types                                    */
/* ************************************************************************** */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  isDone: number;
  createdAt: Date;
  updatedAt: Date;
}

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */
export default function TaskList() {
  /* ************************************************************************** */
  /*                                  API Context                              */
  /* ************************************************************************** */
  const utils = api.useContext();

  /* ************************************************************************** */
  /*                                  Data Fetching                           */
  /* ************************************************************************** */
  const { data, error, isLoading } = api.tasks.taskslist.useQuery();

  /* ************************************************************************** */
  /*                                  Mutations                               */
  /* ************************************************************************** */

  // Mutation suppression d'une tâche avec gestion optimiste du cache
  const deleteMutation = api.tasks.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.tasks.taskslist.cancel();
      const previousData = utils.tasks.taskslist.getData();

      // Suppression immédiate dans le cache pour une UI réactive
      utils.tasks.taskslist.setData(
        undefined,
        (old) => old?.filter((task) => task.id !== id) ?? [],
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Restauration des données en cas d'erreur
      if (context?.previousData) {
        utils.tasks.taskslist.setData(undefined, context.previousData);
      }
      toast.error("Erreur lors de la suppression de la tâche.", {
        style: {
          color: "red",
        },
      });
    },
    onSettled: async () => {
      // Invalidation pour recharger les données du serveur
      await utils.tasks.taskslist.invalidate();
    },
    onSuccess: () => {
      console.log("hello from onSuccess");
      toast.success("La tâche a été supprimer avec succès !", {
        style: {
          color: "green",
        },
      });
    },
  });

  // Mutation pour marquer une tâche comme terminée ou non terminée avec gestion optimiste
  const checkMutation = api.tasks.check.useMutation({
    onMutate: async ({ id, isDone }) => {
      await utils.tasks.taskslist.cancel();
      const previousData = utils.tasks.taskslist.getData();

      // Mise à jour immédiate du statut dans le cache
      utils.tasks.taskslist.setData(
        undefined,
        (old) =>
          old?.map((task) => (task.id === id ? { ...task, isDone } : task)) ??
          [],
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Restauration des données en cas d'erreur
      if (context?.previousData) {
        utils.tasks.taskslist.setData(undefined, context.previousData);
      }
    },
    onSettled: async () => {
      // Rafraîchissement des données
      await utils.tasks.taskslist.invalidate();
    },
  });

  /* ************************************************************************** */
  /*                                  Local State                             */
  /* ************************************************************************** */
  // Identifiant de la tâche sélectionnée pour suppression
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Données de la tâche sélectionnée pour modification
  const [taskToModified, setTaskToModified] = useState<TaskModified>();

  /* ************************************************************************** */
  /*                                  Handlers                                */
  /* ************************************************************************** */
  // Confirme la suppression et déclenche la mutation correspondante
  const handleDeleteConfirmed = () => {
    if (taskToDelete) {
      deleteMutation.mutate({ id: taskToDelete });
      setTaskToDelete(null);
    }
  };

  // Bascule le statut "fait" d'une tâche
  const handleToggle = (id: string, isDone: number) => {
    checkMutation.mutate({ id, isDone });
  };

  /* ************************************************************************** */
  /*                                  Render                                  */
  /* ************************************************************************** */

  // Gestion des états de chargement et d'erreur
  if (isLoading) return <div>Chargement des tâches...</div>;
  if (error) return <div>Erreur lors du chargement des tâches.</div>;

  return (
    <div>
      {/* Liste des tâches */}
      {data?.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-3 rounded-lg border p-4 transition-all duration-200 ${
            task.isDone === 1
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          {/* Checkbox pour marquer la tâche comme faite ou non */}
          <Checkbox
            id={`task-${task.id}`}
            checked={task.isDone === 1}
            onCheckedChange={() => handleToggle(task.id, Number(!task.isDone))}
            className="data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
          />

          {/* Titre et description de la tâche */}
          <label
            htmlFor={`task-${task.id}`}
            className={`flex-1 cursor-pointer transition-all duration-200 ${
              task.isDone === 1
                ? "text-green-700 line-through opacity-75"
                : "text-gray-800"
            }`}
          >
            <strong>{task.title}</strong> — {task.description}
          </label>

          {/* Date de création */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              {new Date(task.createdAt).toLocaleDateString("fr-FR")}
            </span>

            {/* Bouton suppression */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTaskToDelete(task.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
              aria-label="Supprimer la tâche"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {/* Bouton modification */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTaskToModified({
                  id: task.id,
                  title: task.title,
                  description: task.description!,
                })
              }
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
              aria-label="Modifier la tâche"
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Dialogues modaux */}
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
