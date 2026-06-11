export type TodoCategory = "personal" | "work" | "shopping" | "health";

export type TodoFilter = "all" | "active" | "completed";

export type TodoSort = "manual" | "dueDate" | "createdAt" | "category";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
  category: TodoCategory;
  createdAt: number;
  order: number;
}

export const categoryConfig: Record<
  TodoCategory,
  { label: string; className: string }
> = {
  personal: {
    label: "Personal",
    className:
      "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  },
  work: {
    label: "Work",
    className: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  },
  shopping: {
    label: "Shopping",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
  health: {
    label: "Health",
    className: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  },
};

export const filterLabels: Record<TodoFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

export const sortOptions: Array<{ value: TodoSort; label: string }> = [
  { value: "manual", label: "Manual order" },
  { value: "dueDate", label: "Due date" },
  { value: "createdAt", label: "Recently added" },
  { value: "category", label: "Category" },
];

export function createTodoId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

export function isTodoCategory(value: string): value is TodoCategory {
  return (value as TodoCategory) in categoryConfig;
}

export function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}