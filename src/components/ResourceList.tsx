import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart,Trash2, Pencil, Heading1 } from 'lucide-react';
import { SearchBox } from './SearchBox';
import { getCategoryIcon } from './icons/CategoryIcons';
import { Category } from './types/categories';
import toast from 'react-hot-toast';

interface Resource {
  id: string;
  title: string;
  description: string;
  drive_link?: string;
  created_at: string;
  category: Category;
  is_favorite?: boolean;
}

interface ResourceListProps {
  category: Category;
}

export function ResourceList({ category }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editingResource,setEditingResource] = useState<Resource|null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    fetchResources();
  }, [user, showFavorites, category]);

  const fetchResources = async () => {
    let query = supabase
      .from('pdf_resources')
      .select(`
        *,
        user_favorites!left (
          id
        )
      `)
      .eq('category', category);

    if (showFavorites && user) {
      query = query.not('user_favorites', 'is', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      return;
    }

    const resourcesWithFavorites = data.map((resource: any) => ({
      ...resource,
      is_favorite: resource.user_favorites && resource.user_favorites.length > 0
    }));

    setResources(resourcesWithFavorites);
  };

  const toggleFavorite = async (resourceId: string, currentStatus: boolean) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      if (currentStatus) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('pdf_id', resourceId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert([{ user_id: user.id, pdf_id: resourceId }]);

        if (error) throw error;
      }

      await fetchResources();
      toast.success(currentStatus ? 'Removed from favorites' : 'Added to favorites');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  //handling deletion
  const handleDelete = async (id: string) => {
    try {
      // Delete the PDF resource
      const { error: resourceError } = await supabase
        .from('pdf_resources')
        .delete()
        .eq('id', id);
  
      if (resourceError) {
        throw new Error(`Error deleting resource: ${resourceError.message}`);
      }
  
      // Fetch the updated resources list
      await fetchResources();
      toast.success('Resource deleted successfully');
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleUpdate = async (updatedResource: Resource) => {
    try {
      const { error } = await supabase
        .from('pdf_resources')
        .update({
          title: updatedResource.title,
          description: updatedResource.description,
          drive_link: updatedResource.drive_link,
        })
        .eq('id', updatedResource.id);

      if (error) {
        throw new Error(`Error updating resource: ${error.message}`);
      }

      setEditingResource(null);
      await fetchResources(); 
      toast.success('Resource updated successfully');
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
  };
  

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        {user && (
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${showFavorites
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => 
        editingResource && editingResource.id===resource.id?
        (
          <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
              <input
                type="text"
                value={editingResource.title}
                onChange={(e) =>
                  setEditingResource({ ...editingResource, title: e.target.value })
                }
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Title"
              />
              <textarea
                value={editingResource.description}
                onChange={(e) =>
                  setEditingResource({ ...editingResource, description: e.target.value })
                }
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Description"
              />
              <input
                type="text"
                value={editingResource.drive_link || ''}
                onChange={(e) =>
                  setEditingResource({ ...editingResource, drive_link: e.target.value })
                }
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Drive Link"
              />
              <button
                onClick={() => handleUpdate(editingResource)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditingResource(null)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
        )
        
        :(
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
          >
            <div 
              className="cursor-pointer"
              onClick={() => resource.drive_link && window.open(resource.drive_link, '_blank')}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                {getCategoryIcon(resource.category)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-gray-600">{resource.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                Added on {new Date(resource.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {/* new delete button:  */}
            <div className="absolute top-4 right-4 flex gap-2">
              {user && (
                <button
                  onClick={() => toggleFavorite(resource.id, resource.is_favorite || false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      resource.is_favorite 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              )}
              {user && user.id === import.meta.env.VITE_ADMIN_ID && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this resource?')) {
                      handleDelete(resource.id);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-600"
                  title="Delete resource"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              {user && user.id === import.meta.env.VITE_ADMIN_ID && (
                <button
                  onClick={() => {
                     setEditingResource(resource);
                  }}
                  className="p-2 rounded-full hover:bg-green-100 transition-colors text-green-600"
                  title="Delete resource"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              )}
            </div>
            
          </div>

        ))}
        
        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            {showFavorites 
              ? 'No favorite resources found.'
              : 'No resources found matching your search.'}
          </div>
        )}
      </div>
    </div>
  );
}