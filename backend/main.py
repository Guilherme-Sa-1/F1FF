import sys
import time
from src.f1_data import load_session, get_race_telemetry, enable_cache
from src.services.stream import TelemetryStreamServer

def main(year, round_number, session_type='R'):
    print(f"Iniciando Backend FormulaFans: F1 {year} Round {round_number} Sessão '{session_type}'")
    
    enable_cache()
    session = load_session(year, round_number, session_type)
    print(f"Sessão carregada: {session.event['EventName']} - {session.event['RoundNumber']}")

    print("Extraindo e processando telemetria...")
    race_telemetry = get_race_telemetry(session, session_type=session_type)
    frames = race_telemetry['frames']
    
    # === NOVO: Extraindo Nomes e Cores Oficiais Dinamicamente ===
    driver_metadata = {}
    driver_colors_rgb = race_telemetry.get('driver_colors', {})
    
    for drv_num in session.drivers:
        info = session.get_driver(drv_num)
        code = info["Abbreviation"]
        full_name = info["FullName"]
        
        # Pega a cor RGB e converte para código Hexadecimal (#ffffff) para a web
        rgb = driver_colors_rgb.get(code, (128, 128, 128))
        hex_color = f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
        
        driver_metadata[code] = {
            "name": full_name,
            "color": hex_color
        }
    # ============================================================

    print(f"Total de frames carregados: {len(frames)}")

    host = 'localhost'
    port = 9999
    server = TelemetryStreamServer(host=host, port=port)
    server.start()
    print(f"Servidor de telemetria rodando em {host}:{port}")

    try:
        fps = 25
        dt = 1 / fps
        
        for frame in frames:
            # Injeta os metadados no frame antes de o enviar para o React
            frame['metadata'] = driver_metadata
            server.broadcast(frame)
            time.sleep(dt) 
            
        print("Transmissão da corrida concluída!")
        
    except KeyboardInterrupt:
        print("\nEncerrando servidor...")
    finally:
        server.stop()

if __name__ == "__main__":
    target_year = 2024
    target_round = 1
    target_session = 'R'

    if len(sys.argv) > 1:
        target_year = int(sys.argv[1])
    if len(sys.argv) > 2:
        target_round = int(sys.argv[2])
    if len(sys.argv) > 3:
        target_session = sys.argv[3]

    main(target_year, target_round, target_session)