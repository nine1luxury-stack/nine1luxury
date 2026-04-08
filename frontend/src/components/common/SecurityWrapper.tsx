"use client";

import { useEffect } from "react";

export function SecurityWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === 'IMG') {
                e.preventDefault();
            }
        };

        const handleDragStart = (e: DragEvent) => {
            if ((e.target as HTMLElement).tagName === 'IMG') {
                e.preventDefault();
            }
        };

        // Disable right-click on images
        document.addEventListener('contextmenu', handleContextMenu);
        // Disable dragging of images
        document.addEventListener('dragstart', handleDragStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('dragstart', handleDragStart);
        };
    }, []);

    return <>{children}</>;
}
