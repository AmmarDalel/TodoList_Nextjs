"use client";

import { useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "~/trpc/react";

export default function TaskForm() {
  const [task, setTask] = useState({ title: "", description: "" });
  const canAdd = task.title.trim() !== "" && task.description.trim() !== "";
  const utils = api.useContext();
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const { mutate, isError, error, isSuccess } = api.tasks.create.useMutation({
    onSuccess: async () => {
      setTask({ title: "", description: "" });
      successRef.current?.classList.remove("hidden");
      setTimeout(() => {
        successRef.current?.classList.add("hidden");
      }, 3000);

      await utils.tasks.taskslist.invalidate();
    },
    onError: () => {
      errorRef.current?.classList.remove("hidden");
      setTimeout(() => {
        errorRef.current?.classList.add("hidden");
      }, 3000);
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
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      {isSuccess && (
        <p className="mt-2 text-green-600 duration-3000" ref={successRef}>
          La tâche a été ajoutée avec succès !
        </p>
      )}
      {isError && (
        <p className="mt-2 text-red-600" ref={errorRef}>
          {error?.message}
        </p>
      )}
    </div>
  );
}
