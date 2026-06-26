# 🏎️ FormulaFans - Telemetria e Notificações F1

O **FormulaFans** é uma aplicação Full-Stack desenvolvida para extrair, processar e exibir dados reais de telemetria da Fórmula 1. O sistema permite reproduzir o histórico de corridas passadas com precisão de milissegundos e está a ser expandido para um motor de notificações em tempo real.

## ✨ Funcionalidades Atuais

* **Seleção Dinâmica de Corridas:** Escolha qualquer ano e etapa (round) para carregar os dados oficiais diretamente dos servidores da F1.
* **Leaderboard Dinâmico:** Tabela de classificação que se atualiza e reordena automaticamente a cada frame da corrida.
* **Dashboard de Telemetria:** Selecione qualquer piloto para ver mostradores de acelerador, travão, velocidade e mudanças.
* **Mapa da Pista (Track Map):** O circuito é desenhado matematicamente a partir dos dados de GPS da telemetria, com "bolinhas" que representam a posição 2D exata de cada carro.
* **Gestão de Pneus e Cores:** Extração automática das cores oficiais das equipas e compostos de pneus usados.

## 🚀 Arquitetura (Em Desenvolvimento): Notificações ao Vivo

Além do painel de replay, o projeto conta com uma arquitetura de mensageria para sessões ao vivo:
* **Monitorização:** O backend Python (`fastf1.livetiming`) escuta os dados via SignalR.
* **Motor de Regras:** Avalia mudanças de posição, tempos de setor roxos e entradas nas boxes.
* **Orquestração via n8n:** Quando um evento ocorre, um Webhook é disparado para um fluxo no n8n, que formata e entrega a notificação diretamente num telemóvel via app de mensagens.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React.js, Vite, CSS Flexbox/Grid (Mobile First).
* **Backend:** Python 3, FastF1, WebSockets.
* **Automação/Mensageria:** n8n, Webhooks.

## ⚙️ Como Executar Localmente

1. **Backend (Python):**
   ```bash
   cd backend
   pip install fastf1 websockets pandas
   python main.py
Frontend (React):

Bash
cd frontend
npm install
npm run dev
Abra http://localhost:5173 no seu navegador (Desktop ou Mobile).

Desenvolvido por Guilherme Sá.