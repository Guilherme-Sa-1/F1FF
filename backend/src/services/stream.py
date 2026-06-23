import asyncio
import json
import threading
import websockets

class TelemetryStreamServer:
    def __init__(self, host='localhost', port=9999):
        self.host = host
        self.port = port
        self.clients = set()
        self.loop = None
        self.server_thread = None

    def start(self):
        # Inicia o servidor WebSocket em uma thread separada
        self.server_thread = threading.Thread(target=self._start_server, daemon=True)
        self.server_thread.start()

    def _start_server(self):
        # Cria um novo loop de eventos e roda o servidor nele
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(self._run_server())

    async def _run_server(self):
        # Modo moderno de iniciar o servidor websockets
        async with websockets.serve(self._handler, self.host, self.port):
            await asyncio.Future()  # Mantém o servidor rodando infinitamente

    async def _handler(self, websocket):
        self.clients.add(websocket)
        print(f"Novo cliente conectado! Total de clientes: {len(self.clients)}")
        try:
            # Mantém a conexão aberta e escuta (ignora) mensagens do cliente
            async for message in websocket:
                pass
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.clients.remove(websocket)
            print(f"Cliente desconectado. Total de clientes: {len(self.clients)}")

    def broadcast(self, data):
        if not self.loop or not self.clients:
            return
        
        message = json.dumps(data)
        
        async def send_to_all():
            for client in set(self.clients):
                try:
                    await client.send(message)
                except websockets.exceptions.ConnectionClosed:
                    pass

        # Agenda o envio para rodar no loop da thread principal do servidor
        asyncio.run_coroutine_threadsafe(send_to_all(), self.loop)

    def stop(self):
        if self.loop:
            self.loop.call_soon_threadsafe(self.loop.stop)