import { useState, useEffect } from 'react';
import './App.css'; // Importando o arquivo de estilos

// F1 2026 - Cores principais das equipas
const TEAM_COLORS = {
  VER: '#3671C6', HAD: '#3671C6', // Red Bull
  LEC: '#E8002D', HAM: '#E8002D', // Ferrari
  RUS: '#27F4D2', ANT: '#27F4D2', // Mercedes
  NOR: '#FF8000', PIA: '#FF8000', // McLaren
  ALO: '#229971', STR: '#229971', // Aston Martin
  GAS: '#00A1E8', COL: '#00A1E8', // Alpine
  SAI: '#1868DB', ALB: '#1868DB', // Williams
  LAW: '#6692FF', LIN: '#6692FF', // Racing Bulls
  HUL: '#FF2D00', BOR: '#FF2D00', // Audi
  OCO: '#DEE1E2', BEA: '#DEE1E2', // Haas
  PER: '#AAAAAD', BOT: '#AAAAAD'  // Cadillac
};

// Componente visual para os Pneus
const TyreBadge = ({ tyre, age }) => {
  let color = '#FFFFFF';
  let label = 'H'; 
  
  if (tyre === 0) { color = '#FF3333'; label = 'S'; } // Macio
  else if (tyre === 1) { color = '#EBEB00'; label = 'M'; } // Médio
  else if (tyre === 2) { color = '#FFFFFF'; label = 'H'; } // Duro
  else if (tyre === 3) { color = '#39B54A'; label = 'I'; } // Intermédio
  else if (tyre === 4) { color = '#00AEEF'; label = 'W'; } // Chuva

  return (
    <div className="tyre-container">
      <span className="tyre-circle" style={{ border: `2px solid ${color}`, color: color }}>
        {label}
      </span>
      <span style={{ fontSize: '12px', color: '#aaa' }}>{age}v</span>
    </div>
  );
};

// Componente visual da Legenda
const LegendPanel = () => {
  return (
    <div className="legend-panel">
      <h3>📖 Legenda</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Tipos de Pneus</h4>
        <div className="legend-item">
          <span className="tyre-circle" style={{ color: '#FF3333', border: '2px solid #FF3333' }}>S</span>
          <span style={{ fontSize: '14px' }}><strong>Macio:</strong> Mais rápido, desgasta rápido.</span>
        </div>
        <div className="legend-item">
          <span className="tyre-circle" style={{ color: '#EBEB00', border: '2px solid #EBEB00' }}>M</span>
          <span style={{ fontSize: '14px' }}><strong>Médio:</strong> Equilíbrio ideal.</span>
        </div>
        <div className="legend-item">
          <span className="tyre-circle" style={{ color: '#FFFFFF', border: '2px solid #FFFFFF' }}>H</span>
          <span style={{ fontSize: '14px' }}><strong>Duro:</strong> Mais lento, dura muito.</span>
        </div>
        <div className="legend-item">
          <span className="tyre-circle" style={{ color: '#39B54A', border: '2px solid #39B54A' }}>I</span>
          <span style={{ fontSize: '14px' }}><strong>Intermediário:</strong> Pista úmida.</span>
        </div>
        <div className="legend-item">
          <span className="tyre-circle" style={{ color: '#00AEEF', border: '2px solid #00AEEF' }}>W</span>
          <span style={{ fontSize: '14px' }}><strong>Chuva (Wet):</strong> Pista alagada.</span>
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '10px', fontStyle: 'italic' }}>
          * O número ao lado (ex: 5v) indica as voltas de vida útil daquele pneu.
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Status na Pista</h4>
        <div className="legend-item">
          <span className="badge drs">DRS</span>
          <span style={{ fontSize: '14px' }}>Asa traseira aberta (Mais velocidade).</span>
        </div>
        <div className="legend-item">
          <span className="badge pit">PIT</span>
          <span style={{ fontSize: '14px' }}>Carro dentro dos boxes.</span>
        </div>
      </div>
      
      <div>
        <h4>Outros</h4>
        <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', margin: 0, color: '#ddd' }}>
          <li><strong>Barra colorida:</strong> Identifica a cor da equipe.</li>
          <li><strong>Mudança:</strong> Marcha atual que o carro está usando (1 a 8).</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [raceData, setRaceData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9999');
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => setRaceData(JSON.parse(event.data));
    
    return () => ws.close();
  }, []);

  if (!isConnected) {
    return (
      <div className="loading-screen">
        <h2>⏳ A aguardar ligação ao servidor...</h2>
      </div>
    );
  }

  if (!raceData) return <div className="loading-screen"><h2>A processar corrida...</h2></div>;

  const driversList = Object.entries(raceData.drivers)
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.position - b.position);

  return (
    <div className="app-container">
      <div className="layout">
        
        {/* Coluna da Esquerda: Leaderboard */}
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
              const teamColor = TEAM_COLORS[driver.code] || '#888';
              
              return (
                <div key={driver.code} className={`driver-row ${driver.in_pit ? 'in-pit' : ''}`}>
                  <div className="driver-pos">{driver.position}</div>
                  <div style={{ width: '4px', height: '24px', background: teamColor, borderRadius: '2px' }}></div>
                  <div className="driver-code">{driver.code}</div>
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

        {/* Coluna da Direita: Legenda */}
        <LegendPanel />

      </div>
    </div>
  );
}

export default App;