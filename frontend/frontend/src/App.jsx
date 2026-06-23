import { useState, useEffect } from 'react';
import './App.css';

const TyreBadge = ({ tyre, age }) => {
  let color = '#FFFFFF';
  let label = 'H'; 
  if (tyre === 0) { color = '#FF3333'; label = 'S'; } 
  else if (tyre === 1) { color = '#EBEB00'; label = 'M'; } 
  else if (tyre === 2) { color = '#FFFFFF'; label = 'H'; } 
  else if (tyre === 3) { color = '#39B54A'; label = 'I'; } 
  else if (tyre === 4) { color = '#00AEEF'; label = 'W'; } 

  return (
    <div className="tyre-container">
      <span className="tyre-circle" style={{ border: `2px solid ${color}`, color: color }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#aaa' }}>{age}v</span>
    </div>
  );
};

const LegendPanel = () => (
  <div className="legend-panel">
    <h3>📖 Legenda</h3>
    <div style={{ marginBottom: '20px' }}>
      <h4>Tipos de Pneus</h4>
      <div className="legend-item"><span className="tyre-circle" style={{ color: '#FF3333', border: '2px solid #FF3333' }}>S</span><span style={{ fontSize: '14px' }}><strong>Macio</strong></span></div>
      <div className="legend-item"><span className="tyre-circle" style={{ color: '#EBEB00', border: '2px solid #EBEB00' }}>M</span><span style={{ fontSize: '14px' }}><strong>Médio</strong></span></div>
      <div className="legend-item"><span className="tyre-circle" style={{ color: '#FFFFFF', border: '2px solid #FFFFFF' }}>H</span><span style={{ fontSize: '14px' }}><strong>Duro</strong></span></div>
    </div>
    <div style={{ marginBottom: '20px' }}>
      <h4>Status</h4>
      <div className="legend-item"><span className="badge drs">DRS</span><span style={{ fontSize: '14px' }}>Asa traseira aberta.</span></div>
      <div className="legend-item"><span className="badge pit">PIT</span><span style={{ fontSize: '14px' }}>Carro nos boxes.</span></div>
    </div>
  </div>
);

const TelemetryPanel = ({ driver }) => {
  if (!driver) return null;

  return (
    <div className="telemetry-panel">
      {/* Agora mostra o nome completo do piloto na telemetria */}
      <h3>📡 Telemetria - {driver.name}</h3>
      <div className="telemetry-data">
        <div className="pedals">
          <div className="pedal-box">
            <div className="pedal-bar">
              <div className="pedal-fill brake" style={{ height: `${driver.brake}%` }}></div>
            </div>
            <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>TRAVÃO</span>
          </div>

          <div className="pedal-box">
            <div className="pedal-bar">
              <div className="pedal-fill throttle" style={{ height: `${driver.throttle}%` }}></div>
            </div>
            <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>ACEL.</span>
          </div>
        </div>

        <div className="speed-gear">
          <div className="speed-display">
            {Math.round(driver.speed)}
            <span>km/h</span>
          </div>
          <div className="gear-display">
            {driver.gear === 0 ? 'N' : driver.gear}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [raceData, setRaceData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDriverCode, setSelectedDriverCode] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9999');
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => setRaceData(JSON.parse(event.data));
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (raceData && !selectedDriverCode) {
      const leader = Object.entries(raceData.drivers).find(([_, data]) => data.position === 1);
      if (leader) setSelectedDriverCode(leader[0]);
    }
  }, [raceData, selectedDriverCode]);

  if (!isConnected) {
    return <div className="loading-screen"><h2>⏳ A aguardar ligação ao servidor...</h2></div>;
  }

  if (!raceData) return <div className="loading-screen"><h2>A processar corrida...</h2></div>;

  const driversList = Object.entries(raceData.drivers)
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.position - b.position);

  const selectedDriverData = raceData.drivers[selectedDriverCode];
  // Pega os dados dinâmicos do piloto selecionado
  const selectedDriverMeta = raceData.metadata && raceData.metadata[selectedDriverCode] 
    ? raceData.metadata[selectedDriverCode] 
    : { name: selectedDriverCode };

  return (
    <div className="app-container">
      <div className="layout">
        
        <div className="leaderboard">
          <header className="header">
            <h1>🏎️ Leaderboard</h1>
            <div className="stats-group">
              <span className="stat-badge">Volta Líder: <strong>{raceData.lap}</strong></span>
              <span className="stat-badge red">T: {raceData.t.toFixed(1)}s</span>
            </div>
          </header>

          <div className="table-container">
            {driversList.map((driver) => {
              
              // === LEITURA DINÂMICA DA COR E NOME ===
              const driverMeta = raceData.metadata && raceData.metadata[driver.code] 
                ? raceData.metadata[driver.code] 
                : { color: '#888', name: driver.code };
              
              const teamColor = driverMeta.color;
              const isSelected = driver.code === selectedDriverCode;
              
              return (
                <div 
                  key={driver.code} 
                  className={`driver-row ${driver.in_pit ? 'in-pit' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDriverCode(driver.code)}
                >
                  <div className="driver-pos">{driver.position}</div>
                  <div style={{ width: '4px', height: '24px', background: teamColor, borderRadius: '2px' }}></div>
                  <div className="driver-code">{driver.code}</div>
                  
                  {/* Novo bloco exibindo o nome completo do piloto */}
                  <div className="driver-name" title={driverMeta.name}>{driverMeta.name}</div>
                  
                  <TyreBadge tyre={driver.tyre} age={driver.tyre_life} />
                  
                  <div className="driver-speed">
                    {Math.round(driver.speed)} <span>km/h</span>
                  </div>
                  
                  <div className="driver-gear">
                    Mudança: <strong>{driver.gear}</strong>
                  </div>
                  
                  <div className="indicators">
                    {driver.drs >= 10 && <span className="badge drs">DRS</span>}
                    {driver.in_pit && <span className="badge pit">PIT</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="right-column">
          <LegendPanel />
          <TelemetryPanel driver={selectedDriverData ? { code: selectedDriverCode, name: selectedDriverMeta.name, ...selectedDriverData } : null} />
        </div>

      </div>
    </div>
  );
}

export default App;