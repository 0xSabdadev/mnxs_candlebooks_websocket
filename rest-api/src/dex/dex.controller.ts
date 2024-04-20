import { Controller, Get } from '@nestjs/common';
import { Server } from 'ws';
import { HyperliquidService } from '../hyperliquid/hyperliquid.service';
import { VertexProtocolService } from '../vertex-protocol/vertex-protocol.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@Controller('dex')
export class DexController {
  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly vertexProtocolService: VertexProtocolService,
  ) {}

  @Get('hyperliquid/orderbooks')
  async getHyperliquidOrderbooks() {
    return await this.hyperliquidService.getOrderbooks();
  }

  @Get('hyperliquid/candles')
  async getHyperliquidCandles() {
    return await this.hyperliquidService.getCandles();
  }

  @Get('vertex-protocol/orderbooks')
  async getVertexProtocolOrderbooks() {
    return await this.vertexProtocolService.getOrderbooks();
  }

  @Get('vertex-protocol/candles')
  async getVertexProtocolCandles() {
    return await this.vertexProtocolService.getCandles();
  }
}

@WebSocketGateway()
export class DexWebSocketGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly hyperliquidService: HyperliquidService,
    private readonly vertexProtocolService: VertexProtocolService,
  ) {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.hyperliquidService.getOrderbooks().subscribe((data) => {
      this.server.emit('hyperliquidOrderbooks', data);
    });

    this.hyperliquidService.getCandles().subscribe((data) => {
      this.server.emit('hyperliquidCandles', data);
    });

    this.vertexProtocolService.getOrderbooks().subscribe((data) => {
      this.server.emit('vertexProtocolOrderbooks', data);
    });

    this.vertexProtocolService.getCandles().subscribe((data) => {
      this.server.emit('vertexProtocolCandles', data);
    });
  }
}
