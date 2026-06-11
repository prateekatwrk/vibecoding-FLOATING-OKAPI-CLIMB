import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  categoryConfig,
  formatDate,
  type TodoItem,
} from "@/types/todo";

interface TodoItemRowProps {
  todo: TodoItem;
  today: string;
  canDrag: boolean;
  isEditing: boolean;
  editValue: string;
  onToggle: (id: string, completed: boolean) => void;
  onStartEdit: (todo: TodoItem) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onEditValueChange: (value: string) => void;
  onEditKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string,
  ) => void;
  onReorder: (draggedId: string, targetId: string) => void;
}

function getDueInfo(dueDate: string, completed: boolean, today: string) {
  if (!dueDate) {
    return {
      label: "No due date",
      className: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
    };
  }

  if (completed) {
    return {
      label: formatDate(dueDate),
      className:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    };
  }

  if (dueDate < today) {
    return {
      label: `Overdue · ${formatDate(dueDate)}`,
      className: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
    };
  }

  if (dueDate === today) {
    return {
      label: `Today · ${formatDate(dueDate)}`,
      className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    };
  }

  return {
    label: formatDate(dueDate),
    className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  };
}

export function TodoItemRow({
  todo,
  today,
  canDrag,
  isEditing,
  editValue,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditValueChange,
  onEditKeyDown,
  onReorder,
}: TodoItemRowProps) {
  const dueInfo = getDueInfo(todo.dueDate, todo.completed, today);

  return (
    <li
      draggable={canDrag && !isEditing}
      title={canDrag && !isEditing ? "Drag to reorder" : undefined}
      className={cn(
        "group rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md",
        todo.completed && "bg-slate-50",
        canDrag && !isEditing && "cursor-grab active:cursor-grabbing",
      )}
      onDragStart={(event) => {
        if (!canDrag || isEditing) return;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", todo.id);
      }}
      onDragOver={(event) => {
        if (!canDrag || isEditing) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        if (!canDrag || isEditing) return;
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");
        onReorder(draggedId, todo.id);
      }}
    >
      {isEditing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSaveEdit(todo.id);
          }}
          className="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center"
        >
          <Input
            value={editValue}
            onChange={(event) => onEditValueChange(event.target.value)}
            onKeyDown={(event) => onEditKeyDown(event, todo.id)}
            autoFocus
            className="h-11"
            placeholder="Task text"
          />
          <div className="flex gap-2 sm:justify-end">
            <Button type="submit" size="sm" disabled={!editValue.trim()}>
              Save
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-3">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={(checked) => onToggle(todo.id, checked === true)}
            aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
            className="mt-1 h-5 w-5 rounded-md border-slate-300 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={cn(
                  "break-words text-sm font-semibold leading-6 text-slate-950 sm:text-base",
                  todo.completed && "text-slate-400 line-through",
                )}
              >
                {todo.text}
              </p>
              <Badge className={categoryConfig[todo.category].className}>
                {categoryConfig[todo.category].label}
              </Badge>
              <Badge className={dueInfo.className}>{dueInfo.label}</Badge>
            </div>
          </div>

          <div className="flex shrink-0 gap-1 sm:opacity-0 sm:group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onStartEdit(todo)}
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => onDelete(todo.id)}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}