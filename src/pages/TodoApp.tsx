"use client";

import BackButton from "@/components/BackButton";
import * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TodoItemRow } from "@/components/TodoItemRow";
import {
  categoryConfig,
  createTodoId,
  filterLabels,
  isTodoCategory,
  sortOptions,
  type TodoCategory,
  type TodoFilter,
  type TodoItem,
  type TodoSort,
} from "@/types/todo";
import { showError, showSuccess } from "@/utils/toast";

const STORAGE_KEY = "dyad-todos-v1";
const SORT_KEY = "dyad-todos-sort-v1";
const filters: TodoFilter[] = ["all", "active", "completed"];

function compareByDueDate(a: TodoItem, b: TodoItem) {
  if (!a.dueDate && !b.dueDate) {
    return a.order - b.order;
  }

  if (!a.dueDate) {
    return 1;
  }

  if (!b.dueDate) {
    return -1;
  }

  return a.dueDate.localeCompare(b.dueDate) || a.text.localeCompare(b.text);
}

function loadTodos(): TodoItem[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  const parsed = JSON.parse(saved) as TodoItem[];

  return parsed
    .filter((item) => item && typeof item.id === "string")
    .map((item, index) => ({
      id: item.id,
      text: typeof item.text === "string" ? item.text.trim() : "",
      completed: Boolean(item.completed),
      dueDate: typeof item.dueDate === "string" ? item.dueDate : "",
      category: isTodoCategory(item.category) ? item.category : "personal",
      createdAt:
        typeof item.createdAt === "number" ? item.createdAt : Date.now() + index,
      order:
        typeof item.order === "number" && Number.isFinite(item.order)
          ? item.order
          : index,
    }))
    .filter((item) => item.text.length > 0)
    .sort((a, b) => a.order - b.order);
}

function loadSortMode(): TodoSort {
  const saved = localStorage.getItem(SORT_KEY);

  return saved === "dueDate" ||
    saved === "createdAt" ||
    saved === "category"
    ? saved
    : "manual";
}

const selectClassName =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-slate-950 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function TodoApp() {
  const [todos, setTodos] = React.useState<TodoItem[]>(loadTodos);
  const [draft, setDraft] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [category, setCategory] = React.useState<TodoCategory>("personal");
  const [filter, setFilter] = React.useState<TodoFilter>("all");
  const [sortMode, setSortMode] = React.useState<TodoSort>(loadSortMode);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const today = React.useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  React.useEffect(() => {
    localStorage.setItem(SORT_KEY, sortMode);
  }, [sortMode]);

  const visibleTodos = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...todos];

    if (query) {
      result = result.filter((todo) =>
        [
          todo.text,
          categoryConfig[todo.category].label,
          todo.dueDate,
        ].some((value) => value.toLowerCase().includes(query)),
      );
    }

    if (filter === "active") {
      result = result.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    if (sortMode === "dueDate") {
      result.sort(compareByDueDate);
    }

    if (sortMode === "createdAt") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (sortMode === "category") {
      result.sort(
        (a, b) =>
          categoryConfig[a.category].label.localeCompare(
            categoryConfig[b.category].label,
          ) || a.text.localeCompare(b.text),
      );
    }

    if (sortMode === "manual") {
      result.sort((a, b) => a.order - b.order);
    }

    return result;
  }, [todos, searchQuery, filter, sortMode]);

  const total = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = total - completedCount;
  const progressValue = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const filterCounts: Record<TodoFilter, number> = {
    all: total,
    active: activeCount,
    completed: completedCount,
  };
  const canDrag =
    sortMode === "manual" && filter === "all" && searchQuery.trim() === "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();

    if (!text) {
      showError("Type a task before adding it.");
      return;
    }

    const newTodo: TodoItem = {
      id: createTodoId(),
      text,
      completed: false,
      dueDate,
      category,
      createdAt: Date.now(),
      order: todos.length,
    };

    setTodos((current) => [...current, newTodo]);
    setDraft("");
    setDueDate("");
    setCategory("personal");
    showSuccess("Task added.");
  }

  function toggleTodo(id: string, completed: boolean) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
    showSuccess("Task deleted.");
  }

  function startEdit(todo: TodoItem) {
    setEditingId(todo.id);
    setEditValue(todo.text);
  }

  function saveEdit(id: string) {
    const text = editValue.trim();

    if (!text) {
      showError("Task text cannot be empty.");
      return;
    }

    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    );
    setEditingId(null);
    setEditValue("");
    showSuccess("Task updated.");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  function handleEditKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string,
  ) {
    if (event.key === "Escape") {
      cancelEdit();
    }
  }

  function markAllComplete() {
    if (activeCount === 0) return;

    setTodos((current) =>
      current.map((todo) => ({ ...todo, completed: true })),
    );
    showSuccess("All tasks marked complete.");
  }

  function clearCompleted() {
    if (completedCount === 0) return;

    setTodos((current) => current.filter((todo) => !todo.completed));
    showSuccess("Completed tasks cleared.");
  }

  function resetList() {
    if (todos.length === 0) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SORT_KEY);
    setTodos([]);
    setSortMode("manual");
    setFilter("all");
    setSearchQuery("");
    setEditingId(null);
    showSuccess("Todo list reset.");
  }

  function reorderTodos(draggedId: string, targetId: string) {
    if (draggedId === targetId) return;

    const fromIndex = todos.findIndex((todo) => todo.id === draggedId);
    const toIndex = todos.findIndex((todo) => todo.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...todos];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setTodos(
      reordered.map((todo, index) => ({
        ...todo,
        order: index,
      })),
    );
    showSuccess("Task order updated.");
  }

  return (
    <>
      <BackButton />
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
          <section className="space-y-4">
            <Card className="overflow-hidden border-indigo-100 shadow-xl shadow-indigo-100/60">
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                  <ListTodo className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl tracking-tight">Todo List</CardTitle>
                <CardDescription>
                  Capture tasks, due dates, categories, and progress in one clean
                  workspace.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="grid gap-3">
                  <div>
                    <Label htmlFor="task">New task</Label>
                    <Input
                      id="task"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="e.g. Review project brief"
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="dueDate">Due date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        min={today}
                        onChange={(event) => setDueDate(event.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={category}
                        onChange={(event) =>
                          setCategory(event.target.value as TodoCategory)
                        }
                        className={selectClassName}
                      >
                        {(Object.keys(categoryConfig) as TodoCategory[]).map(
                          (item) => (
                            <option key={item} value={item}>
                              {categoryConfig[item].label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add task
                  </Button>
                </form>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-indigo-700">
                      {progressValue}%
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-3" />

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      <p className="text-xl font-bold text-slate-950">{total}</p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                    <div className="rounded-2xl bg-indigo-50 p-3">
                      <p className="text-xl font-bold text-indigo-700">
                        {activeCount}
                      </p>
                      <p className="text-xs text-indigo-600">Active</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-3">
                      <p className="text-xl font-bold text-emerald-700">
                        {completedCount}
                      </p>
                      <p className="text-xs text-emerald-600">Done</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/70">
              <CardContent className="flex gap-3 py-4">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <p className="text-sm leading-6 text-amber-900">
                  Tip: switch to manual order and clear search/filter to drag tasks
                  into your preferred sequence.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <CardTitle>Your tasks</CardTitle>
                    <CardDescription>
                      {activeCount === 0
                        ? "All caught up."
                        : `${activeCount} active ${activeCount === 1 ? "task" : "tasks"} remaining.`}
                    </CardDescription>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={markAllComplete}
                      disabled={activeCount === 0}
                    >
                      Mark all
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearCompleted}
                      disabled={completedCount === 0}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      Clear done
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px] lg:items-end">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search tasks..."
                      className="h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="filter">Filter</Label>
                    <select
                      id="filter"
                      value={filter}
                      onChange={(event) =>
                        setFilter(event.target.value as TodoFilter)
                      }
                      className={selectClassName}
                    >
                      {filters.map((item) => (
                        <option key={item} value={item}>
                          {filterLabels[item]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="sort">Sort</Label>
                    <select
                      id="sort"
                      value={sortMode}
                      onChange={(event) =>
                        setSortMode(event.target.value as TodoSort)
                      }
                      className={selectClassName}
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {todos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      No tasks yet
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                      Add your first task above and start tracking what matters
                      today.
                    </p>
                  </div>
                ) : visibleTodos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                      <ListTodo className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      No matching tasks
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                      Try a different search, filter, or sort option.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {visibleTodos.map((todo) => (
                      <TodoItemRow
                        key={todo.id}
                        todo={todo}
                        today={today}
                        canDrag={canDrag}
                        isEditing={editingId === todo.id}
                        editValue={editValue}
                        onToggle={toggleTodo}
                        onStartEdit={startEdit}
                        onSaveEdit={saveEdit}
                        onCancelEdit={cancelEdit}
                        onDelete={deleteTodo}
                        onEditValueChange={setEditValue}
                        onEditKeyDown={handleEditKeyDown}
                        onReorder={reorderTodos}
                      />
                    ))}
                  </ul>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetList}
                    disabled={todos.length === 0}
                    className="text-slate-500"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset list
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}