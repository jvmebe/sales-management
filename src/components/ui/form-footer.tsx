import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FixedFormFooterProps {
  formId: string;
  cancelHref: string;
  isSubmitting: boolean;
  deleteButton?: React.ReactNode;
}

export function FormFooter({
  formId,
  cancelHref,
  isSubmitting,
  deleteButton,
}: FixedFormFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 bg-background/95 border-t p-4 backdrop-blur-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="ml-80">
          {deleteButton}
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" type="button" asChild>
            <Link href={cancelHref}>Cancelar</Link>
          </Button>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </footer>
  );
}