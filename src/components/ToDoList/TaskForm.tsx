"use client";

/* ************************************************************************** */
/*                                Dépendances                                */
/* ************************************************************************** */
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "~/trpc/react";
import { Toaster, toast } from "sonner";
import { useSession } from "next-auth/react";

/* ************************************************************************** */
/*                         Définition du composant TaskForm                  */
/* ************************************************************************** */
export default function TaskForm() {
  /* -------------------------------------------------------------------------- */
  /*                                 État local                                 */
  /* -------------------------------------------------------------------------- */
  // État pour stocker les champs du formulaire (titre et description)
  const [task, setTask] = useState({ title: "", description: "" });

  // Vérifie si les champs sont valides pour activer le bouton "Ajouter"
  const canAdd = task.title.trim() !== "" && task.description.trim() !== "";

  /* -------------------------------------------------------------------------- */
  /*                             Hooks & contexte API                           */
  /* -------------------------------------------------------------------------- */
  const utils = api.useContext(); // Pour gérer l’invalidation/réinitialisation du cache TRPC
  const session = useSession(); // Récupère les infos de session de l’utilisateur connecté

  /* -------------------------------------------------------------------------- */
  /*                          Mutation : Création de tâche                      */
  /* -------------------------------------------------------------------------- */
  const createMutation = api.tasks.create.useMutation({
    // Mise à jour optimiste : modifie localement les données avant la confirmation serveur
    onMutate: async (newTask) => {
      await utils.tasks.taskslist.cancel(); // Annule les requêtes en cours
      const previousData = utils.tasks.taskslist.getData(); // Sauvegarde les anciennes données

      // Met à jour temporairement le cache avec la nouvelle tâche
      utils.tasks.taskslist.setData(undefined, (old) => [
        ...(old ?? []),
        {
          id: "" + Math.random().toString(36).substr(2, 9), // ID temporaire
          userId: JSON.stringify(session.data?.user?.id),
          title: newTask.title,
          description: newTask.description,
          isDone: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      return { previousData }; // Contexte pour rollback en cas d’erreur
    },

    // En cas d'erreur : restaure les anciennes données et affiche un toast rouge
    onError: (_err, _newTask, context) => {
      if (context?.previousData) {
        utils.tasks.taskslist.setData(undefined, context.previousData);
      }
      toast.error("Erreur lors de la création de la tâche.", {
        style: {
          color: "red",
        },
      });
    },

    // À la fin de la mutation (succès ou échec), on rafraîchit les données
    onSettled: async () => {
      await utils.tasks.taskslist.invalidate();
    },

    // Si succès : affiche un toast vert et réinitialise le formulaire
    onSuccess: () => {
      toast.success("La tâche a été ajoutée avec succès !", {
        style: {
          color: "green",
        },
      });
      setTask({ title: "", description: "" });
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                 Handlers                                   */
  /* -------------------------------------------------------------------------- */
  // Gestion du clic sur le bouton "Ajouter"
  const handleAdd = () => {
    if (!canAdd) return;
    createMutation.mutate({
      title: task.title,
      description: task.description,
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Render                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div>
      {/* Champs de saisie et bouton d'ajout */}
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Titre de la tâche"
          value={task.title}
          onChange={(e) =>
            setTask((prev) => ({ ...prev, title: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && canAdd) handleAdd();
          }}
        />
        <Input
          type="text"
          placeholder="Description de la tâche"
          value={task.description}
          onChange={(e) =>
            setTask((prev) => ({ ...prev, description: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && canAdd) handleAdd();
          }}
        />
        <Button onClick={handleAdd} disabled={!canAdd} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Affichage des toasts (succès/erreur) */}
      <Toaster position="top-center" />
    </div>
  );
}
