import React, { createContext, useContext, useState, ReactNode } from 'react';

type Page = 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'order-success';

interface NavigationContextType {
  currentPage: Page;
  pageData: any;
  navigateTo: (page: Page, data?: any) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const [history, setHistory] = useState<Array<{ page: Page; data: any }>>([]);

  const navigateTo = (page: Page, data?: any) => {
    setHistory((prev) => [...prev, { page: currentPage, data: pageData }]);
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setCurrentPage(previous.page);
      setPageData(previous.data);
      setHistory((prev) => prev.slice(0, -1));
      window.scrollTo(0, 0);
    }
  };

  return (
    <NavigationContext.Provider
      value={{ currentPage, pageData, navigateTo, goBack }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
