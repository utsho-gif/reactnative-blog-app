import React, { createContext, useContext, useState, ReactNode } from 'react';

type BlogContextType = {
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [refresh, setRefresh] = useState(0);

  return (
    <BlogContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogContext must be used within a BlogProvider');
  }
  return context;
};
