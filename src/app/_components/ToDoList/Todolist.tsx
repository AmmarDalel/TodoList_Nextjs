import TaskForm from "./TaskForm"
import TaskList, { type Task } from "./TaskList"



export default async function Todolist() {
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Ma Liste de Tâches</h1>
          <p className="text-gray-600">Organisez votre journée efficacement</p>
        </div>

        <TaskForm />
        <TaskList  />
      </div>
    </div>
  )
}
