'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSavedListings } from '@/lib/contexts/SavedListingsContext';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { count } = useSavedListings();
  const { user, profile, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const initial = profile?.full_name?.charAt(0).toUpperCase() || user?.phone?.slice(-2) || '?';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-heading font-bold text-lg leading-none">R</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-slate-900 tracking-tight leading-none">
                Riwaq
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase leading-none mt-0.5">
                Tunisie
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/annonces"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium px-4 py-2 rounded-lg"
            >
              Parcourir
            </Link>
            <Link
              href="/categorie/cafe-coffee"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium px-4 py-2 rounded-lg"
            >
              Catégories
            </Link>
            <Link
              href="/sauvegardees"
              data-tour-id="tour-save"
              className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium px-3 py-2 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Auth: login or avatar */}
            {!authLoading && (
              user ? (
                <div ref={dropdownRef} className="relative" data-tour-id="tour-account">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                  >
                    {initial}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
                      <Link
                        href="/mon-compte"
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Mon compte
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/connexion"
                  data-tour-id="tour-account"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-medium px-4 py-2 rounded-lg"
                >
                  Se connecter
                </Link>
              )
            )}

            <div className="w-px h-6 bg-slate-200 mx-2" />
            <Link
              href="/deposer"
              data-tour-id="tour-post"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
            >
              + Déposer une annonce
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-in">
            <Link
              href="/annonces"
              className="block text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-medium py-2.5 px-3 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Parcourir les annonces
            </Link>
            <Link
              href="/categorie/cafe-coffee"
              className="block text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-medium py-2.5 px-3 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Catégories
            </Link>
            <Link
              href="/sauvegardees"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-medium py-2.5 px-3 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Sauvegardées
              {count > 0 && (
                <span className="w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Auth mobile */}
            {!authLoading && (
              user ? (
                <>
                  <Link
                    href="/mon-compte"
                    className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-medium py-2.5 px-3 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {initial}
                    </div>
                    Mon compte
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2 w-full text-left text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-medium py-2.5 px-3 rounded-lg cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/connexion"
                  className="block text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-medium py-2.5 px-3 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Se connecter
                </Link>
              )
            )}

            <div className="pt-2">
              <Link
                href="/deposer"
                className="block bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors text-center"
                onClick={() => setMobileOpen(false)}
              >
                + Déposer une annonce
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
