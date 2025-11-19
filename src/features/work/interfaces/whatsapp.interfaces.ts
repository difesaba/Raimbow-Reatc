/**
 * 📱 Interfaces para módulo de mensajes de WhatsApp
 * Gestión de mensajes y notificaciones del día
 */

/**
 * 💬 TodayMessage - Mensaje de WhatsApp del día
 * Respuesta del endpoint /api/whatsapp/messages/today
 */
export interface TodayMessage {
  QueueId: number;
  Message: string;
  Status: string;
  TaskId: number | null;
  CreatedAt: string;
  ProcessedAt: string | null;
  UserName: string;
  UserWhatsApp: string;
  MinutesSinceCreated: number;
  PriorityLabel: string;
  StatusDetailed: string;
  Name: string;
  SubName: string;
}

/**
 * 📋 TodayMessagesResponse - Respuesta del endpoint de mensajes del día
 * El backend puede devolver un array directo o un objeto envuelto
 */
export interface TodayMessagesResponse {
  ok?: boolean;
  data?: TodayMessage[];
  messages?: TodayMessage[];
}
