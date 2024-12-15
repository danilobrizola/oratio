'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link href={`/?page=${currentPage - 1}`} passHref>
          <Button variant="outline">Anterior</Button>
        </Link>
      )}
      <span className="py-2 px-4 bg-primary text-primary-foreground rounded">
        Página {currentPage} de {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={`/?page=${currentPage + 1}`} passHref>
          <Button variant="outline">Próxima</Button>
        </Link>
      )}
    </div>
  )
}
