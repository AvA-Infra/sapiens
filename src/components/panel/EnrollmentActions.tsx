import { ActionForm } from "@/components/panel/ActionForm";
import { setEnrollmentStatus } from "@/lib/admin-actions";

export type EnrollmentStatus = "ativa" | "pendente" | "cancelada";

export const statusLabel: Record<EnrollmentStatus, string> = {
  ativa: "Com acesso",
  pendente: "Esperando liberação",
  cancelada: "Acesso cancelado",
};

function StatusButton({ id, status, label, variant }: { id: string; status: EnrollmentStatus; label: string; variant: "primary" | "quiet" | "danger" }) {
  return (
    <ActionForm action={setEnrollmentStatus} submitLabel={label} pendingLabel="..." variant={variant} className="space-y-0">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
    </ActionForm>
  );
}

/** Botões de um clique para a matrícula, conforme a situação atual. */
export function EnrollmentActions({ id, status }: { id: string; status: EnrollmentStatus }) {
  if (status === "pendente") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <StatusButton id={id} status="ativa" label="Liberar acesso" variant="primary" />
        <StatusButton id={id} status="cancelada" label="Recusar" variant="quiet" />
      </div>
    );
  }
  if (status === "ativa") return <StatusButton id={id} status="cancelada" label="Cancelar acesso" variant="quiet" />;
  return <StatusButton id={id} status="ativa" label="Liberar de novo" variant="quiet" />;
}
