"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Play, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CollectionCardProps {
  id: number;
  title: string;
  words: number;
  lastStudied: string;
  onEdit: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

export function CollectionCard({
  id,
  title,
  words,
  lastStudied,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(title);

  const handleEditSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id, newName);
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
    setIsDeleteOpen(false);
  };

  const openEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNewName(title);
    setIsEditOpen(true);
  };

  const openDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteOpen(true);
  };

  const playSession = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/collections/${id}/learn`;
  };

  return (
    <>
      <Card className="shadow-sm h-full hover:shadow-md transition-shadow group relative">
        <CardContent className="p-4 space-y-2 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="pr-6">
              <h2 className="font-semibold line-clamp-1" title={title}>
                {title}
              </h2>
              <p className="text-sm text-gray-500">{words} words</p>
            </div>

            <div className="flex gap-1 shrink-0">
              <div
                className="p-1.5 hover:bg-blue-50 rounded-full cursor-pointer transition-colors group/edit"
                onClick={openEdit}
              >
                <Pencil className="h-4 w-4 text-gray-400 group-hover/edit:text-blue-600" />
              </div>
              <div
                className="p-1.5 hover:bg-blue-50 rounded-full cursor-pointer transition-colors group/play"
                onClick={playSession}
              >
                <Play className="h-4 w-4 text-[#2563EB] group-hover/play:fill-[#2563EB]" />
              </div>
              <div
                className="p-1.5 hover:bg-red-50 rounded-full cursor-pointer transition-colors group/del"
                onClick={openDelete}
              >
                <Trash2 className="h-4 w-4 text-gray-400 group-hover/del:text-red-600" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end pt-2">
            <p className="text-xs text-gray-400">Last studied: {lastStudied}</p>
            <Share2 className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Collection name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              collection and all words inside it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
