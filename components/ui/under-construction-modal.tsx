'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UnderConstructionModal({ isOpen, onClose }: UnderConstructionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Under Construction</DialogTitle>
          <DialogDescription>
            This feature is currently under construction. Please check back later!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 