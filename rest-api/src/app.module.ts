import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HyperliquidService } from './hyperliquid/hyperliquid.service';
import { VertexProtocolService } from './vertex-protocol/vertex-protocol.service';
import { DexController } from './dex/dex.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DexController],
  providers: [HyperliquidService, VertexProtocolService],
})
export class AppModule {}
