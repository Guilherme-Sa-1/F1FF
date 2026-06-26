import sys
import json
import asyncio
import websockets
import fastf1
from src.f1_data import load_session, get_race_telemetry, enable_cache

enable_cache()

async def stream_telemetry(websocket):
    print("\n🟢 Cliente conectado! Aguardando seleção...")
    try:
        # 1. Espera a mensagem do React com a escolha da corrida
        msg = await websocket.recv()
        config = json.loads(msg)
        year = int(config.get('year', 2024))
        round_number = int(config.get('round', 1))
        session_type = 'R'

        print(f"⚙️ Processando: {year} Round {round_number}...")
        
        # 2. Carrega a sessão escolhida dinamicamente
        session = load_session(year, round_number, session_type)
        session.load()
        event_name = session.event['EventName']
        print(f"✅ Sessão carregada: {event_name}")

        race_telemetry = get_race_telemetry(session, session_type=session_type)
        frames = race_telemetry['frames']

        # 3. Desenho da pista
        try:
            fastest_lap = session.laps.pick_fastest()
            tel = fastest_lap.get_telemetry()
            track_shape = [{"x": float(x), "y": float(y)} for x, y in zip(tel['X'].to_numpy()[::4], tel['Y'].to_numpy()[::4])]
        except Exception:
            track_shape = []

        # 4. Nomes e Cores
        driver_metadata = {}
        driver_colors_rgb = race_telemetry.get('driver_colors', {})
        for drv_num in session.drivers:
            try:
                info = session.get_driver(drv_num)
                code = info["Abbreviation"]
                rgb = driver_colors_rgb.get(code, (128, 128, 128))
                driver_metadata[code] = {
                    "name": info["FullName"],
                    "color": f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
                }
            except:
                continue

        # 5. Inicia a transmissão
        print(f"🚀 Transmitindo {len(frames)} frames...")
        for frame in frames:
            frame['metadata'] = driver_metadata
            frame['track_shape'] = track_shape
            frame['event_name'] = event_name
            
            await websocket.send(json.dumps(frame))
            await asyncio.sleep(1 / 25) # 25 FPS
            
        print("🏁 Transmissão concluída!")

    except websockets.exceptions.ConnectionClosed:
        print("🔴 Cliente desconectou (Voltou ao menu).")
    except Exception as e:
        print(f"❌ Erro: {e}")

async def main_server():
    host, port = "localhost", 9999
    print(f"📡 Backend rodando aguardando conexões em ws://{host}:{port}")
    # Inicia o servidor e atende requisições continuamente
    async with websockets.serve(stream_telemetry, host, port):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main_server())