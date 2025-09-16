import { useAuth } from '@/lib/auth';
import { toast } from '@/lib/toast';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
    const { signOut, isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        signOut()
        toast.success("Logged out successfully");
        navigate("/auth");
    };


    return (
        <div>
            <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
    )
}

export default LogoutButton
