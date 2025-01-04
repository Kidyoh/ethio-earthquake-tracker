'use client';

import { Button } from '@/components/ui/button';
import { Earthquake } from '@/lib/types';
import { Facebook, Twitter, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UnderConstructionModal } from '@/components/ui/under-construction-modal';
import { useState } from 'react';

interface ShareAlertProps {
  earthquake: Earthquake;
}

export function ShareAlert({ earthquake }: ShareAlertProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleShareClick}>
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareClick}>
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UnderConstructionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
} 