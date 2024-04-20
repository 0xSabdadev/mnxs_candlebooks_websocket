import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HyperliquidService } from './hyperliquid/hyperliquid.service';
import { VertexProtocolService } from './vertex-protocol/vertex-protocol.service';
import { DexController } from './dex/dex.controller';
import { HttpModule } from '@nestjs/axios';
import { Logger } from './services/logger/logger.service';
import rateLimit from 'express-rate-limit';
import { ErrorMiddleware } from './middleware/error.middleware';

@Module({
  imports: [HttpModule],
  controllers: [DexController],
  providers: [HyperliquidService, VertexProtocolService, Logger],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100, 
    });

    consumer.apply(ErrorMiddleware).forRoutes('*');
    consumer.apply(limiter).forRoutes('*');
  }
}