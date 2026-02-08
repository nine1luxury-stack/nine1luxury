"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string; // For simplicity in this mock, we can store ISO string or formatted string
    type: 'order' | 'user' | 'system';
    read: boolean;
    timestamp: number; // To help with sorting/time calculation
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp' | 'time'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                const formatted = data.map((n: Notification) => ({
                    ...n,
                    timestamp: new Date(n.createdAt).getTime(),
                    time: new Date(n.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute:'2-digit' })
                }));
                setNotifications(formatted);
            }
        } catch (e) {
            console.error("Failed notification fetch", e);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const addNotification = async (data: Omit<Notification, 'id' | 'read' | 'timestamp' | 'time'>) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                fetchNotifications();
            }
        } catch (e) { console.error(e); }
    };

    const markAsRead = async (id: string) => {
        // Optimistic
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        try {
            await fetch('/api/notifications', {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ id })
            });
        } catch { 
            fetchNotifications(); // Revert on fail
        }
    };

    const markAllAsRead = async () => {
         setNotifications(prev => prev.map(n => ({ ...n, read: true })));
         try {
             await fetch('/api/notifications', {
                 method: 'PATCH',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ action: 'mark_all_read' })
            });
         } catch {}
    };

    const clearNotifications = async () => {
        setNotifications([]);
        try {
             await fetch('/api/notifications', { method: 'DELETE' });
        } catch {
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
