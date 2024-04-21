import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';
import { Observable, of } from 'rxjs';

@Injectable()
export class HyperliquidService {
  private ws: WebSocket;
  private orderbooksCache: any;
  private candlesCache: any;

  constructor() {
    this.orderbooksCache = {};
    this.candlesCache = {};
    this.initWebSocket();
  }

  private initWebSocket() {
    const wsUrl = process.env.HYPERLIQUID_WEBSOCKET_URL;
    this.ws = new WebSocket(wsUrl);

    this.ws.on('open', () => {
      console.log('Connected to Hyperliquid WebSocket');
      this.subscribeToOrderBook(['BTC', 'ETH', 'SOL']);
      this.subscribeToCandlestick(['BTC', 'ETH', 'SOL'], '1m');
    });

    this.ws.on('message', (data) => {
      console.log('Received data from Hyperliquid WebSocket:', data);
    });

    this.ws.on('close', () => {
      console.log('Connection to Hyperliquid WebSocket closed');
    });
  }

  private subscribeToOrderBook(coins: string[]) {
    coins.forEach(coin => {
      const subscriptionMessage = JSON.stringify({
        method: 'subscribe',
        subscription: {
          type: 'l2Book',
          coin: coin,
        },
      });
      this.ws.send(subscriptionMessage);
    });
  }

  private subscribeToCandlestick(coins: string[], interval: string) {
    coins.forEach(coin => {
      const subscriptionMessage = JSON.stringify({
        method: 'subscribe',
        subscription: {
          type: 'candle',
          coin: coin,
          interval: interval,
        },
      });
      this.ws.send(subscriptionMessage);
    });
  }

  getOrderbooks(coins: string[]): Observable<any> {
    const cachedOrderbooks = coins.reduce((acc, coin) => {
      if (this.orderbooksCache[coin]) {
        acc[coin] = this.orderbooksCache[coin];
      }
      return acc;
    }, {});

    if (Object.keys(cachedOrderbooks).length === coins.length) {
      return of(cachedOrderbooks);
    } else {
      return new Observable(observer => {
        this.ws.on('message', (data) => {
          const parsedData = JSON.parse(data.toString());
          if (parsedData.subscription && coins.includes(parsedData.subscription.coin) && parsedData.data) {
            this.orderbooksCache[parsedData.subscription.coin] = parsedData.data;
            if (Object.keys(this.orderbooksCache).length === coins.length) {
              observer.next(this.orderbooksCache);
            }
          }
        });
      });
    }
  }

  getCandles(coins: string[]): Observable<any> {
    const cachedCandles = coins.reduce((acc, coin) => {
      if (this.candlesCache[coin]) {
        acc[coin] = this.candlesCache[coin];
      }
      return acc;
    }, {});

    if (Object.keys(cachedCandles).length === coins.length) {
      return of(cachedCandles);
    } else {
      return new Observable(observer => {
        this.ws.on('message', (data) => {
          const parsedData = JSON.parse(data.toString());
          if (parsedData.subscription && coins.includes(parsedData.subscription.coin) && parsedData.data) {
            this.candlesCache[parsedData.subscription.coin] = parsedData.data;
            if (Object.keys(this.candlesCache).length === coins.length) {
              observer.next(this.candlesCache);
            }
          }
        });
      });
    }
  }

}
