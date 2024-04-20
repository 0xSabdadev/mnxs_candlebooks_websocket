import { Injectable } from '@nestjs/common';
import WebSocket from 'ws';
import axios from 'axios';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class VertexProtocolService {
  private ws: WebSocket;

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.ws = new WebSocket('wss://gateway.prod.vertexprotocol.com/v1/ws');
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

  getOrderBook(productId: number, digest: string): Observable<any> {
    const message = JSON.stringify({
      type: 'order',
      product_id: productId,
      digest: digest,
    });
    this.ws.send(message);

    return new Observable(observer => {
      this.ws.on('message', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.request_type === 'query_order') {
          observer.next(parsedData.response);
        }
      });
    });
  }

  getCandlesticks(productId: number, granularity: number, limit: number): Observable<any> {
    const restUrl = `https://gateway.prod.vertexprotocol.com/v1/archive`;
    const requestBody = {
      candlesticks: {
        product_id: productId,
        granularity: granularity,
        limit: limit,
      }
    };

    return from(axios.post(restUrl, requestBody)).pipe(
      map(response => response.data.candlesticks),
      catchError(error => {
        console.error('Error fetching candlesticks:', error);
        return of([]);
      })
    );
  }
}
