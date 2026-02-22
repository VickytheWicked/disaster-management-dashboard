import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ResourceInventory } from './components/ResourceInventory';
import { UserManagement } from './components/UserManagement';
import { Team } from './components/Team';
import { AlertsCenter } from './components/AlertsCenter';
import { Analytics } from './components/Analytics';
import { Profile } from './components/Profile';
import { Toaster } from './components/ui/sonner';

type Page = 'login' | 'register' | 'dashboard' | 'resources' | 'users' | 'alerts' | 'analytics' | 'team' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // const handleLogin = (email: string, password: string) => {
  //   // In production, this would validate against a backend
  //   setIsAuthenticated(true);
  //   setUserName(email.split('@')[0]);
  //   setCurrentPage('dashboard');
  // };
  interface LoginResponse {
    name: string;
    id: number; // or string, depending on your backend!
    // add other fields here if your backend returns more info
  }
  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.status !== 200) {
        throw new Error('Invalid credentials');
      }
      const data: LoginResponse = await response.json();
      setIsAuthenticated(true);
      setUserName(data.name);
      setCurrentPage('dashboard');

    } catch (err: any) {
      alert(err.message);
    }
  };


  // const handleRegister = async ( email: string, password: string,name:string,phone:string): Promise<void> => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/auth/register', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password,name,phone })
  //     });
  //     if (response.status !== 201) {
  //       throw new Error('Registration failed');
  //     }
  //     // Optionally, you can log the user in directly after registration
  //     setIsAuthenticated(false);
  //     setCurrentPage('login');
  //   } catch (err: any) {
  //     alert(err.message);
  //   }
  // };


  const handleRegister = async (data: any) => {
    // In production, this would create a new user in the backend
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, name: data.name, phone: data.phone, role: data.role })   //need to do something with the role
      });
      if (response.status !== 201) {
        throw new Error('Registration failed');
      }
      // Optionally, you can log the user in directly after registration
      setIsAuthenticated(false);
      setCurrentPage('login');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
    setUserName('');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'resources':
        return <ResourceInventory />;
      case 'users':
        return <UserManagement />;
      case 'alerts':
        return <AlertsCenter />;
      case 'analytics':
        return <Analytics />;
      case 'team':
        return <Team />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <>
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
          <Toaster position="top-right" richColors />
        </>
      );
    }
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={userName}
      >
        {renderPage()}
      </Layout>
      <Toaster position="top-right" richColors />
    </>
  );
}
