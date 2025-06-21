'use client'

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'mobile';
  onSearch?: (query: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, variant = 'default', onSearch, ...props }, ref) => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        if (onSearch) {
          onSearch(query.trim());
        } else {
          // Navegación por defecto a eventos con búsqueda
          router.push(`/events?search=${encodeURIComponent(query.trim())}`);
        }
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch(e as any);
      }
    };

    return (
      <form onSubmit={handleSearch} className={cn(
        'relative group',
        variant === 'mobile' ? 'w-full' : 'flex-1 max-w-md'
      )}>
        <Search className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors duration-300 pointer-events-none',
          variant === 'mobile' ? 'icon-xs' : 'icon-sm'
        )} />
        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={cn(
            'input-search w-full transition-all duration-300',
            variant === 'mobile' 
              ? 'pl-10 pr-4 py-3 text-sm' 
              : 'pl-12 pr-4 py-3 text-sm',
            className
          )}
          {...props}
        />
      </form>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
