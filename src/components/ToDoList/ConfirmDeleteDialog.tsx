"use client";

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "~/components/ui/alert-dialog";

/* ************************************************************************** */
/*                                  Props Type                                */
/* ************************************************************************** */
interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

/* ************************************************************************** */
/*                             Component Definition                           */
/* ************************************************************************** */
export default function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmer la suppression",
  description = "Êtes-vous sûr(e) de vouloir supprimer cet élément ? Cette action est irréversible.",
}: ConfirmDeleteDialogProps) {
  /* ************************************************************************** */
  /*                                   Render                                  */
  /* ************************************************************************** */
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Titre de la boîte de dialogue */}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {/* Description de la confirmation */}
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 pt-4">
          {/* Bouton annuler */}
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="btn"
          >
            Non
          </AlertDialogCancel>

          {/* Bouton confirmer suppression */}
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="btn btn-danger"
          >
            Oui, supprimer
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
