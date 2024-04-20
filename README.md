![mnx cover](https://media.licdn.com/dms/image/D563DAQGCAagNuSNUPg/image-scale_191_1128/0/1702209133763/manexus_cover?e=2147483647&v=beta&t=XjP47H-qopznPty9joJFd91FWte_in8nngVDQgxv79U)

# Exchange Data (DEX) API

The Exchange Data (DEX) API is a project that provides services for accessing data from various cryptocurrency exchanges. This project uses NestJS as the backend framework and WebSocket for real-time communication with cryptocurrency exchanges.

## Features

- **Hyperliquid Service**: Service for accessing data from the Hyperliquid cryptocurrency exchange.
- **Vertex Protocol Service**: Service for accessing data from the Vertex Protocol cryptocurrency exchange.
- **WebSocket Gateway**: Connects services with clients via WebSocket to provide real-time data.

## Installation

1. Make sure you have Node.js and npm installed on your computer.
2. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/0xSabdadev/mnxs_candlebooks_websocket.git
    ```

3. Navigate to the project directory:

    ```bash
    cd mnxs_candlebooks_websocket/rest-api
    ```

4. Install all dependencies by running the command:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    npm run start:dev
    ```

2. The server will run on `http://localhost:3000` by default.

3. Access the following endpoints to retrieve data:

    - **Hyperliquid Orderbooks**: `GET /dex/hyperliquid/orderbooks?coin={coin}`
    - **Hyperliquid Candles**: `GET /dex/hyperliquid/candles?coin={coin}`
    - **Vertex Protocol Orderbooks**: `GET /dex/vertex-protocol/orderbooks?productId={productId}&digest={digest}`
    - **Vertex Protocol Candles**: `GET /dex/vertex-protocol/candles?productId={productId}&granularity={granularity}&limit={limit}`

4. Use WebSocket to get real-time data. You can connect to the WebSocket at `ws://localhost:3000` and use the following events:

    - `hyperliquidOrderbooks`: Get orderbooks from Hyperliquid.
    - `hyperliquidCandles`: Get candlesticks from Hyperliquid.
    - `vertexProtocolOrderbook`: Get orderbook from Vertex Protocol.
    - `vertexProtocolCandlesticks`: Get candlesticks from Vertex Protocol.

## Contributing

You can contribute to this project by making a pull request. Make sure to read the contribution guidelines beforehand.

## License

This project is licensed under the [MIT License](LICENSE).
