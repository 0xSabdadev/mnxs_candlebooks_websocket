import { Controller, Get, Query } from '@nestjs/common';
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
  async getHyperliquidOrderbooks(@Query('coin') coin: string) {
    return await this.hyperliquidService.getOrderbooks([coin]);
  }

  @Get('hyperliquid/candles')
  async getHyperliquidCandles(@Query('coin') coin: string) {
    return await this.hyperliquidService.getCandles([coin]);
  }

  @Get('vertex-protocol/orderbooks')
  async getVertexProtocolOrderbooks(@Query('productId') productId: number, @Query('digest') digest: string) {
    return await this.vertexProtocolService.getOrderBook(productId, digest);
  }

  @Get('vertex-protocol/candles')
  async getVertexProtocolCandles(@Query('productId') productId: number, @Query('granularity') granularity: number, @Query('limit') limit: number) {
    return await this.vertexProtocolService.getCandlesticks(productId, granularity, limit);
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
    const productId = 1;
    const digest = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const granularity = 60;
    const limit = 2;

    this.hyperliquidService.getOrderbooks(['BTC', 'ETH', 'SOL']).subscribe((data) => {
      this.server.emit('hyperliquidOrderbooks', data);
    });

    this.hyperliquidService.getCandles(['BTC', 'ETH', 'SOL']).subscribe((data) => {
      this.server.emit('hyperliquidCandles', data);
    });

    this.vertexProtocolService.getOrderBook(productId, digest).subscribe((data) => {
      this.server.emit('vertexProtocolOrderbook', data);
    });
    
    this.vertexProtocolService.getCandlesticks(productId, granularity, limit).subscribe((data) => {
      this.server.emit('vertexProtocolCandlesticks', data);
    });
    
  }
}


