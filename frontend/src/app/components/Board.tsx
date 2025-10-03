"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTask, createTask, deleteTask } from "./../lib/api"; // ✅ added deleteTask
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Trash2 } from "lucide-react"; // ✅ lucide-react for icon

const statuses = ["Todo", "InProgress", "Done"] as const;
type Status = typeof statuses[number];

type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
};

const ItemTypes = { CARD: "CARD" };

export default function Board() {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      updateTask(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id), // ✅ DELETE API
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const handleDrop = (taskId: string, newStatus: Status) => {
    const previousTasks = queryClient.getQueryData(["tasks"]) as Task[];

    queryClient.setQueryData(["tasks"], (old: Task[] = []) =>
      old.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    updateMutation.mutate(
      { id: taskId, status: newStatus },
      {
        onError: () => {
          queryClient.setQueryData(["tasks"], previousTasks);
        },
      }
    );
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error loading tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Task Board (Drag & Drop)</h1>

        {/* Add Task Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTask.title.trim()) return;
            createMutation.mutate(newTask);
            setNewTask({ title: "", description: "" });
          }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Title *"
            className="p-2 border rounded w-1/3"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded w-1/3"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={createMutation.isPending || !newTask.title.trim()}
          >
            {createMutation.isPending ? "Adding..." : "Add Task"}
          </button>
        </form>

        {/* Kanban Columns */}
        <div className="grid grid-cols-3 gap-4">
          {statuses.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((task: Task) => task.status === status)}
              onDropCard={(taskId) => handleDrop(taskId, status)}
              onDelete={(id) => deleteMutation.mutate(id)} // ✅ passed down
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

function Column({
  status,
  tasks,
  onDropCard,
  onDelete,
}: {
  status: Status;
  tasks: Task[];
  onDropCard: (taskId: string) => void;
  onDelete: (id: string) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: { id: string }) => {
      onDropCard(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getColumnColor = () => {
    if (isOver && canDrop) return "bg-blue-100 border-2 border-blue-400";
    if (isOver) return "bg-blue-50";
    return "bg-gray-100";
  };

  return (
    <div
      ref={drop}
      className={`p-4 rounded shadow min-h-[300px] transition-colors ${getColumnColor()}`}
    >
      <h2 className="text-xl font-semibold mb-3 flex justify-between items-center">
        <span>{status}</span>
        <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm">
          {tasks.length}
        </span>
      </h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id} task={task} onDelete={onDelete} />
        ))}
        {tasks.length === 0 && (
          <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-3 rounded shadow cursor-move hover:shadow-md transition-all flex justify-between items-start ${
        isDragging ? "opacity-50 rotate-2" : "opacity-100"
      }`}
    >
      <div>
        <h3 className="font-bold text-gray-800">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        <div className="mt-2 text-xs text-gray-400">Drag to move</div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="ml-2 text-red-500 hover:text-red-700"
        title="Delete Task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
