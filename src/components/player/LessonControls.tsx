"use client";

import { useActionState, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { postComment, setLessonCompleted, type CommentState } from "@/lib/lesson-actions";
import { cn } from "@/lib/cn";

export function CompleteButton({ lessonId, completed, path }: { lessonId: string; completed: boolean; path: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        aria-pressed={completed}
        onClick={() =>
          start(async () => {
            const res = await setLessonCompleted(lessonId, !completed, path);
            setError(res.ok ? null : res.error);
          })
        }
        className={cn(
          "inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold transition-colors disabled:opacity-60",
          completed ? "bg-sky-100 text-navy-900 hover:bg-sky-50" : "bg-navy-900 text-paper hover:bg-navy-700",
        )}
      >
        <Check className="size-5" aria-hidden />
        {completed ? "Aula concluída (desmarcar)" : "Marcar como concluída"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

const initial: CommentState = {};

export function CommentForm({ lessonId, path }: { lessonId: string; path: string }) {
  const [state, action, pending] = useActionState(
    async (prev: CommentState, fd: FormData) => {
      const res = await postComment(prev, fd);
      return res;
    },
    initial,
  );

  return (
    <form action={action} key={state.ok ? "sent" : "idle"} className="space-y-3">
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="path" value={path} />
      <label htmlFor="comentario" className="font-semibold text-navy-900">
        Dúvidas e comentários
      </label>
      <textarea
        id="comentario"
        name="body"
        rows={3}
        required
        maxLength={2000}
        className="block w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink focus:border-sky-500"
        placeholder="Escreva sua dúvida sobre esta aula"
      />
      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
