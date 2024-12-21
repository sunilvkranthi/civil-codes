import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Trash } from 'lucide-react';
import { SearchBox } from './SearchBox';

interface PDFResource {
  id: string;
  title: string;
  description: string;
  drive_link: string;
  created_at: string;
}

export function PDFList() {
  const [resources, setResources] = useState<PDFResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user,setUser] = useState(null);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string>("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchResources();
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user || null);
    });
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from('pdf_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      return;
    }

    setResources(data || []);
  };

  //handling deletion
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('pdf_resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
      return;
    }

    // Update resources after deletion
    setResources(resources.filter((resource) => resource.id !== id));
    setDeletingResourceId(null); // Reset deleting resource ID
    setShowInput(false);
  };

  const handleConfirmDelete = (event: React.FormEvent) => {
    event.preventDefault();
    if (confirmDelete.toLowerCase() === 'delete') {
      if (deletingResourceId) {
        handleDelete(deletingResourceId);
        setConfirmDelete("");
      }
    } else {
      setConfirmDelete("");
      alert('Please type "delete" to confirm.');
      setShowInput(false); // Close input box if invalid input
    }
  };

  const handleCancelDelete=()=>{
    setShowInput(false);
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SearchBox value={searchQuery} onChange={setSearchQuery} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.open(resource.drive_link, '_blank')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {resource.title}
            </h3>
            <p className="text-gray-600">{resource.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              Added on {new Date(resource.created_at).toLocaleDateString()}
            </div>
            {user && (
              <div>
              <button
                onClick={(event) =>{
                  event.stopPropagation();
                  setDeletingResourceId(resource.id);
                  setShowInput(true);
                  // handleDelete(resource.id)
                }}
                className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </button>

              {showInput && deletingResourceId === resource.id && (
                  <form onSubmit={handleConfirmDelete} className="mt-4">
                    <input onClick={(event)=>event.stopPropagation()}
                      type="text"
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                      placeholder="Type 'delete' to confirm"
                      className="border border-gray-300 rounded px-3 py-1 mr-2"
                    />
                    <button
                       onClick={(event)=>{
                        event.stopPropagation();
                       }}
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={(event) =>{
                        event?.stopPropagation();
                        handleCancelDelete();
                      }}
                      className="bg-gray-600 text-white px-4 py-2 ml-2 rounded"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ))}
        
        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No PDFs found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}