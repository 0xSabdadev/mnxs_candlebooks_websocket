import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, interval, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import WebSocket from 'ws';

@Injectable()
export class VertexProtocolService {
  private ws: WebSocket;
  private orderbooksCache: any;
  private candlesCache: any;

  constructor(private httpService: HttpService) {
    this.orderbooksCache = null;
    this.candlesCache = null;
    this.initWebSocket();
    this.startDataRefreshing();
  }

  private initWebSocket() {
    this.ws = new WebSocket('wss://vertex-protocol.com/ws');
    this.ws.on('open', () => {
      console.log('Connected to Vertex Protocol WebSocket');
    });
    this.ws.on('message', (data) => {
      console.log('Received data from Vertex Protocol WebSocket:', data);
    });
    this.ws.on('close', () => {
      console.log('Connection to Vertex Protocol WebSocket closed');
    });
  }

  private startDataRefreshing() {
    interval(60000).pipe(
      switchMap(() => this.fetchOrderbooks()),
      catchError((error) => {
        console.error('Error refreshing Vertex Protocol orderbooks:', error);
        return [];
      }),
    ).subscribe((data) => {
      this.orderbooksCache = data;
    });

    interval(60000).pipe(
      switchMap(() => this.fetchCandles()),
      catchError((error) => {
        console.error('Error refreshing Vertex Protocol candles:', error);
        return [];
      }),
    ).subscribe((data) => {
      this.candlesCache = data;
    });
  }

  private fetchOrderbooks(): Observable<any> {
    return this.httpService.get('https://vertex-protocol.com/api/orderbooks').pipe(
      map((response) => response.data),
    );
  }

  private fetchCandles(): Observable<any> {
    return this.httpService.get('https://vertex-protocol.com/api/candles').pipe(
      map((response) => response.data),
    );
  }

  getOrderbooks(): Observable<any> {
    if (this.orderbooksCache) {
      return of(this.orderbooksCache);
    } else {
      return this.fetchOrderbooks();
    }
  }

  getCandles(): Observable<any> {
    if (this.candlesCache) {
      return of(this.candlesCache);
    } else {
      return this.fetchCandles();
    }
  }
}