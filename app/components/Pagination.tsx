'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Button 
          variant="outline" 
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>
      )}
      <span className="py-2 px-4 bg-primary text-primary-foreground rounded">
        Página {currentPage} de {totalPages}
      </span>
      {currentPage < totalPages && (
        <Button 
          variant="outline" 
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </Button>
      )}
    </div>
  )
}
