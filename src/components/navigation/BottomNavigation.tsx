import React from 'react';
import { Home, Compass, Search, Heart, User, ShieldAlert, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'stickers' | 'search' | 'favorites' | 'profile' | 'admin';

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
  showAdminTab?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  showAdminTab = false,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Inicio', icon: Home },
    { id: 'explore' as NavTab, label: 'Explorar', icon: Compass },
    { id: 'search' as NavTab, label: 'Buscar', icon: Search },
    { id: 'stickers' as NavTab, label: 'Stickers', icon: Sparkles },
    { id: 'favorites' as NavTab, label: 'Favoritos', icon: Heart, badge: favoritesCount > 0 ? favoritesCount : undefined },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  if (showAdminTab) {
    tabs.push({ id: 'admin' as NavTab, label: 'Admin', icon: ShieldAlert, badge: undefined });
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass-nav pt-1 max-w-lg mx-auto shadow-2xl">
      <div className="flex items-stretch justify-between px-1 py-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center py-2 px-2 min-w-[56px] min-h-[56px] flex-1 rounded-2xl transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-[#FF4D8D]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active ambient glow pill */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-[#FF4D8D] shadow-sm shadow-[#FF4D8D]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.7]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF4D8D] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 font-medium transition-all ${isActive ? 'font-bold text-white' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
