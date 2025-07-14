/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import { Toaster } from "sonner";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */
export default async function Todolist() {
  /* ************************************************************************** */
  /*                                  Render                                  */
  /* ************************************************************************** */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-2xl">
        {/* Titre et description */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            Ma Liste de Tâches
          </h1>
          <p className="text-gray-600">Organisez votre journée efficacement</p>
        </div>
        <Toaster position="top-center" />

        {/* Formulaire d'ajout de tâche */}
        <TaskForm />

        {/* Liste des tâches */}
        <TaskList />
      </div>
    </div>
  );
}
