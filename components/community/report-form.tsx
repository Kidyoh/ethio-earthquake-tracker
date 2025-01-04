'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UnderConstructionModal } from '@/components/ui/under-construction-modal';
import { AlertTriangle } from 'lucide-react';

export function ReportForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReportDamageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleReportDamageClick}>
        <AlertTriangle className="mr-2 h-4 w-4" />
        Report Damage
      </Button>

      <UnderConstructionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
} 