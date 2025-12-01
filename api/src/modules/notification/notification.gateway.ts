// ===========================================
// NOTIFICATION GATEWAY
// WebSocket Gateway para notificações em tempo real
// Permite comunicação bidirecional entre servidor e clientes
// ===========================================

import {
  WebSocketGateway,
  WebSocketServer,
  // SubscribeMessage, Confirma Regra***
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Order } from '../order/entities/order.entity';

// Gateway WebSocket para notificações em tempo real
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  notifyNewOrderToAdmin(order: Order) {
    throw new Error('Method not implemented.');
  }
  // Servidor WebSocket para emissão de eventos
  @WebSocketServer()
  server: Server;

  // Logger para rastreamento de conexões e eventos
  private readonly logger = new Logger(NotificationGateway.name);

  // Mapa de clientes conectados
  private readonly clients: Map<string, Socket> = new Map();

  // Gerencia conexão de novo cliente
  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.clients.set(client.id, client);
    this.logger.log(`Total de clientes: ${this.clients.size}`);
  }

  // Gerencia desconexão de cliente
  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.clients.delete(client.id);
    this.logger.log(`Total de clientes: ${this.clients.size}`);
  }

  // Notifica administradores sobre novo pedido
  notifyNewOrder(orderId: number, orderData?: any) {
    this.logger.log(`Notificando novo pedido #${orderId}`);

    this.server.emit('new_order', {
      orderId,
      message: `Novo pedido #${orderId} recebido!`,
      timestamp: new Date().toISOString(),
      data: orderData,
    });
  }

  // Notifica clientes sobre mudança de status do pedido
  notifyOrderStatusChange(
    orderId: number,
    newStatus: string,
    message?: string,
  ) {
    this.logger.log(`Pedido #${orderId} - Status: ${newStatus}`);

    this.server.emit(`order_${orderId}_status`, {
      orderId,
      status: newStatus,
      message: message || `Pedido #${orderId} atualizado para: ${newStatus}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Notifica sobre pagamento aprovado
  notifyPaymentApproved(orderId: number, paymentData?: any) {
    this.logger.log(`Pagamento aprovado - Pedido #${orderId}`);

    this.server.emit(`order_${orderId}_payment`, {
      orderId,
      status: 'approved',
      message: `Pagamento do pedido #${orderId} aprovado!`,
      timestamp: new Date().toISOString(),
      data: paymentData,
    });
  }

  // Emite evento para todos os clientes conectados
  broadcast(event: string, data: any) {
    this.logger.log(`Broadcast: ${event}`);
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  // Retorna quantidade de clientes conectados
  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}
