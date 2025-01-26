import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { ResourceList } from './components/ResourceList';
import { ResourceUploadForm } from './components/ResourceUploadForm';
import { CategoryTabs } from './components/CategoryTabs';
import { LogOut } from 'lucide-react';
import { Category } from './components/types/categories';
import { Footer } from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('code');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* NavBar  */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">CIVIL CODES</h1>
              </div>
              {user && (
                <div className="flex items-center">
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {user && (<>
                  <CategoryTabs
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                  <ResourceList category={activeCategory} />
                  {user && user.id === import.meta.env.VITE_ADMIN_ID && (
                    <div className="mt-8">
                      <ResourceUploadForm category={activeCategory} />
                    </div>
                  )}
                </>)}
                  {!user && <AuthForm/>}
                </>
              }
            />
            <Route path="*" element={<Navigate to={"/"}/>} />
          </Routes>
        </main>
      </div>

      {/* footer */}
      {
        activeCategory==="formula"&&<Footer/>
      }
      
    </Router>

   
  );
}

export default App;
