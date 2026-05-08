'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Category, Listing } from '@/lib/types';
import { PERSONAS, PERSONA_STORAGE_KEY } from '@/lib/constants/personas';
import type { CuisineType } from '@/lib/types';
import ExplorerSection from './ExplorerSection';
import CategoryGrid from './CategoryGrid';
import FeaturedListings from './FeaturedListings';

interface HomeContentProps {
  categories: Category[];
  listings: Listing[];
  activeCuisineTypes: string[];
}

export default function HomeContent({ categories, listings, activeCuisineTypes }: HomeContentProps) {
  const t = useTranslations('personas');
  const [activePersona, setActivePersona] = useState('all');
  const explorerRef = useRef<HTMLDivElement>(null);

  // Load persona from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(PERSONA_STORAGE_KEY);
    if (saved && PERSONAS.some((p) => p.key === saved)) {
      setActivePersona(saved);
    }
  }, []);

  const handlePersonaSelect = (key: string) => {
    const newKey = key === activePersona ? 'all' : key;
    setActivePersona(newKey);
    localStorage.setItem(PERSONA_STORAGE_KEY, newKey);
  };

  // Close explorer when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (explorerRef.current && !explorerRef.current.contains(e.target as Node)) {
      setActivePersona('all');
      localStorage.setItem(PERSONA_STORAGE_KEY, 'all');
    }
  }, []);

  useEffect(() => {
    if (activePersona === 'all') return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePersona, handleClickOutside]);

  const persona = PERSONAS.find((p) => p.key === activePersona);
  const highlightSlugs = persona?.categorySlugs || [];
  const personaLabel = persona ? t(persona.key) : undefined;

  // Map slugs to category IDs for filtering listings
  const filterCategoryIds = useMemo(() => {
    if (highlightSlugs.length === 0) return null; // null = no filter
    return categories
      .filter((c) => highlightSlugs.includes(c.slug))
      .map((c) => c.id);
  }, [highlightSlugs, categories]);

  const isPersonaActive = activePersona !== 'all';

  return (
    <>
      <div ref={explorerRef}>
        <ExplorerSection
          activePersona={activePersona}
          onSelect={handlePersonaSelect}
          listings={listings}
          categories={categories}
          filterCategoryIds={filterCategoryIds}
          personaLabel={personaLabel}
          activeCuisineTypes={activeCuisineTypes as CuisineType[]}
        />
      </div>
      <div
        className="category-grid-wrapper"
        data-hidden={isPersonaActive}
      >
        <div>
          <CategoryGrid
            categories={categories}
            highlightSlugs={highlightSlugs.length > 0 ? highlightSlugs : undefined}
          />
        </div>
      </div>
      <FeaturedListings
        listings={listings}
        categories={categories}
        filterCategoryIds={filterCategoryIds}
        personaLabel={isPersonaActive ? personaLabel : undefined}
        isHidden={isPersonaActive}
      />
    </>
  );
}
