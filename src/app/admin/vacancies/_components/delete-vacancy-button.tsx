"use client";

import { deleteVacancy } from "@/lib/actions/vacancies";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteVacancyButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  return (
    <form
      action={async (formData) => {
        setPending(true);
        await deleteVacancy(formData);
      }}
      onSubmit={(e) => {
        if (!confirm("Удалить вакансию?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        className="text-zinc-400 hover:bg-brand-50 hover:text-brand-700"
      >
        Удалить
      </Button>
    </form>
  );
}
