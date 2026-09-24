export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  category: 'collection' | 'new_drop' | 'premium' | 'system';
  read: boolean;
  actionTarget?: string; // categoryId or collectionId
}

const STORAGE_NOTIFS_KEY = 'yugen_notifications_v1';

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-01',
    title: 'Nueva colección: Tokyo After Midnight 🌃',
    body: '6 nuevos fondos nocturnos con estética de neón y estilo cinematográfico.',
    timeAgo: 'Reciente',
    category: 'collection',
    read: false,
    actionTarget: 'col-tokyo-after-midnight',
  },
  {
    id: 'notif-02',
    title: 'Colección Cyberpunk en 4K Ultra HD 🔥',
    body: 'Fondos optimizados para pantallas AMOLED con negros puros y alto contraste.',
    timeAgo: '1d',
    category: 'new_drop',
    read: false,
    actionTarget: 'cat-cyberpunk',
  },
  {
    id: 'notif-03',
    title: 'Bienvenido a YŪGEN (幽玄) ✨',
    body: 'Disfruta de más de 200 wallpapers originales diseñados en resolución 4K nativa.',
    timeAgo: '3d',
    category: 'system',
    read: true,
  },
];

class NotificationService {
  private notifications: InAppNotification[] = [];

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem(STORAGE_NOTIFS_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      } else {
        this.notifications = [...INITIAL_NOTIFICATIONS];
        this.saveNotifications();
      }
    } catch {
      this.notifications = [...INITIAL_NOTIFICATIONS];
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(this.notifications));
    } catch {
      // silent
    }
  }

  getAll(): InAppNotification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markAsRead(id: string): InAppNotification[] {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications();
    return this.getAll();
  }

  markAllAsRead(): InAppNotification[] {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.saveNotifications();
    return this.getAll();
  }

  deleteNotification(id: string): InAppNotification[] {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
    return this.getAll();
  }

  clearAll(): InAppNotification[] {
    this.notifications = [];
    this.saveNotifications();
    return [];
  }
}

export const notificationService = new NotificationService();
