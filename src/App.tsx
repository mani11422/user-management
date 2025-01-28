import React, { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import type { User, UserAction, UserFormData } from './types';

// Using a mock API for development, replace with actual API in production
const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [formAction, setFormAction] = useState<UserAction>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      
      // Transform API data to match our schema
      const transformedUsers = data.map((user: any) => ({
        id: user.id,
        firstName: ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Deepak', 'Pooja', 'Rajesh', 'Meera'][user.id - 1] || 'User',
        lastName: ['Kumar', 'Sharma', 'Patel', 'Gupta', 'Singh', 'Verma', 'Reddy', 'Joshi', 'Malhotra', 'Mehta'][user.id - 1] || 'Name',
        email: user.email,
        department: ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'IT', 'Legal', 'Product', 'Customer Support'][user.id - 1] || 'Department',
      }));
      
      setUsers(transformedUsers);
    } catch (err) {
      setError('Unable to load users. Please try again later.');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setFormAction('add');
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormAction('edit');
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Unable to delete user. Please try again later.');
    }
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    try {
      if (formAction === 'add') {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to add user');
        
        setUsers([...users, { ...formData, id: users.length + 1 }]);
      } else if (formAction === 'edit' && selectedUser) {
        const response = await fetch(`${API_URL}/${selectedUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
          headers: {
            'Content-type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to update user');
        
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...user, ...formData } : user
        ));
      }
      
      setIsFormOpen(false);
    } catch (err) {
      setError('Unable to save user. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Employee Directory</h1>
            <button
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Employee
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg">
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          </div>
        </div>
      </div>

      <UserForm
        isOpen={isFormOpen}
        action={formAction}
        user={selectedUser}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default App;