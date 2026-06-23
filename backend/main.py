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
    print(f"Total de frames carregados: {len(frames)}")

    host = 'localhost'
    port = 9999
    server = TelemetryStreamServer(host=host, port=port)
    server.start()
    print(f"Servidor de telemetria rodando em {host}:{port}")
    print("Aguardando conexões... Pressione Ctrl+C para parar.")

    try:
        fps = 25
        dt = 1 / fps
        
        for frame in frames:
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