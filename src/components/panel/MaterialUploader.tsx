"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addMaterial } from "@/lib/panel-actions";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Field, inputClass } from "./ActionForm";

const MAX_MB = 25;

function safeName(name: string) {
  return (
    name
      .replace(/\.pdf$/i, "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "material"
  );
}

/** Envia o PDF direto para o bucket privado e depois registra o material na aula. */
export function MaterialUploader({ lessonId, courseId }: { lessonId: string; courseId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file") as File | null;
    const title = String(fd.get("title") ?? "").trim();

    if (!file || file.size === 0) return setMsg({ type: "error", text: "Escolha um arquivo PDF." });
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) return setMsg({ type: "error", text: "O arquivo precisa ser um PDF." });
    if (file.size > MAX_MB * 1024 * 1024) return setMsg({ type: "error", text: `O PDF passa de ${MAX_MB} MB.` });
    if (title.length < 2) return setMsg({ type: "error", text: "Dê um nome ao material." });

    setBusy(true);
    setMsg(null);
    const path = `${courseId}/${lessonId}/${crypto.randomUUID().slice(0, 8)}-${safeName(file.name)}.pdf`;
    const supabase = createBrowserSupabase();
    const { error: upErr } = await supabase.storage.from("materials").upload(path, file, {
      contentType: "application/pdf",
      upsert: false,
    });
    if (upErr) {
      setBusy(false);
      return setMsg({ type: "error", text: "Não foi possível enviar o arquivo. Tente de novo." });
    }
    const res = await addMaterial(lessonId, title, path);
    setBusy(false);
    if (res.error) {
      // O arquivo subiu mas não foi registrado: remove para não deixar lixo no bucket.
      await supabase.storage.from("materials").remove([path]);
      return setMsg({ type: "error", text: res.error });
    }
    form.reset();
    setMsg({ type: "ok", text: res.message ?? "Material adicionado." });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-card border border-line p-5">
      <Field label="Nome do material">
        <input name="title" required maxLength={140} className={inputClass} placeholder="Ex.: Lista de exercícios" />
      </Field>
      <Field label="Arquivo PDF" hint={`até ${MAX_MB} MB`}>
        <input name="file" type="file" accept="application/pdf,.pdf" required className={`${inputClass} py-2`} />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 font-semibold text-paper hover:bg-navy-700 disabled:opacity-60"
        >
          {busy ? "Enviando..." : "Enviar material"}
        </button>
        {msg && (
          <p role={msg.type === "error" ? "alert" : "status"} className={`text-sm font-medium ${msg.type === "error" ? "text-red-700" : "text-sky-600"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}
