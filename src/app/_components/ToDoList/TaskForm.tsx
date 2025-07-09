"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "~/trpc/react";

export default function TaskForm() {
  const [task, setTask] = useState({ title: "", description: "" });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canAdd = task.title.trim() !== "" && task.description.trim() !== "";

  const utils = api.useContext();
  const { mutate } = api.tasks.create.useMutation({
    onSuccess: () => {
      setSuccessMessage("La tâche a été ajoutée avec succès !");
      setErrorMessage(null);
      setTask({ title: "", description: "" }); 
      utils.tasks.taskslist.invalidate();
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1000);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    },
  });

  const handleAdd = () => {
    if (!canAdd) return;
    mutate({
      title: task.title,
      description: task.description,
    });
  };

  return (
    <div>
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
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>
      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
    </div>
  );
}
