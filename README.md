Aqui está uma proposta de `README.md` completo, organizado e profissional para o seu projeto FormulaFans. Pode copiar este texto e guardá-lo na pasta raiz do seu projeto.

---

# 🏎️ FormulaFans - Telemetria F1 em Tempo Real

O **FormulaFans** é uma aplicação Full-Stack que extrai, processa e exibe dados reais de telemetria da Fórmula 1. Com ele, podes acompanhar o Leaderboard, a telemetria ao vivo de qualquer piloto (acelerador, travão, velocidade e mudança) e o mapa dinâmico da pista com a posição exata dos carros, exatamente como nas transmissões oficiais.

## ✨ Funcionalidades

* **Leaderboard Dinâmico:** Tabela de classificação em tempo real que se reordena automaticamente a cada ultrapassagem.
* **Identificação Automática:** Lê diretamente da API da F1 os nomes completos dos pilotos e as cores oficiais das equipas da temporada selecionada.
* **Gestão de Pneus:** Mostra o composto atual (Macio, Médio, Duro, Intermédio ou Chuva) e a idade do pneu (número de voltas).
* **Dashboard de Telemetria:** Seleciona qualquer piloto na grelha para ver mostradores em tempo real do uso do acelerador, travão, velocidade e mudanças.
* **Mapa da Pista (Track Map):** Desenho exato do circuito carregado diretamente da telemetria, com "bolinhas" que representam a posição 2D de cada carro em pista.
* **Design Responsivo:** Interface escura e profissional, totalmente otimizada para Desktop, Tablets e Telemóveis (Mobile First Design).

---

## 🛠️ Tecnologias Utilizadas

### Backend (Python)

* **[Python 3.10+](https://www.python.org/):** Linguagem principal do servidor.
* **[FastF1](https://www.google.com/search?q=https://docs.fastf1.dev/):** Biblioteca essencial para extrair os dados oficiais de telemetria da Fórmula 1.
* **[WebSockets](https://websockets.readthedocs.io/):** Para criar um servidor de streaming assíncrono que envia dados em tempo real para o navegador.

### Frontend (React)

* **[React.js](https://react.dev/):** Biblioteca para a construção da interface do utilizador.
* **[Vite](https://vitejs.dev/):** Compilador super-rápido de ambiente de desenvolvimento (com SWC).
* **CSS Puro / Flexbox / Grid:** Para um design leve, sem dependência de bibliotecas externas de estilos pesadas.

---

## 🚀 Como Correr o Projeto Localmente

### Pré-requisitos

Certifica-te de que tens instalados no teu computador:

* [Node.js](https://nodejs.org/) (versão 18+)
* [Python](https://www.python.org/) (versão 3.10+)

### Passo 1: Iniciar o Backend (Servidor de Telemetria)

O backend é responsável por descarregar a corrida da internet e criar o servidor WebSocket.

1. Abre o teu terminal e navega para a pasta `backend`:
```bash
cd backend

```


2. *(Opcional mas recomendado)* Cria e ativa um ambiente virtual:
```bash
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Mac/Linux:
source venv/bin/activate

```


3. Instala as dependências:
```bash
pip install fastf1 websockets pandas

```


4. Inicia o servidor. Podes passar o Ano, a Ronda e o Tipo de Sessão como argumentos (ex: `R` para Race, `Q` para Qualy):
```bash
python main.py 2024 1 R

```


*Se vires a mensagem "Servidor de telemetria rodando em localhost:9999", o backend está pronto!*

### Passo 2: Iniciar o Frontend (Interface Visual)

O frontend é a página web que se liga ao backend para desenhar os carros e os gráficos.

1. Abre um **novo terminal** (sem fechar o do backend) e navega para a pasta `frontend`:
```bash
cd frontend

```


2. Instala as dependências do Node:
```bash
npm install

```


3. Inicia o ambiente de desenvolvimento do Vite:
```bash
npm run dev

```


4. Abre o teu navegador e acede ao link fornecido pelo terminal (geralmente `http://localhost:5173`).

---

## 📱 Acesso via Telemóvel

Podes aceder ao painel através do teu telemóvel para o usar como um "segundo ecrã" enquanto vês a corrida na TV:

1. Garante que o telemóvel e o computador estão ligados à mesma rede Wi-Fi.
2. Descobre o endereço IP local do teu computador (ex: `192.168.1.15`).
3. No telemóvel, abre o navegador e escreve: `http://SEU_IP_AQUI:5173`
4. *Nota:* Pode ser necessário alterar o endereço do WebSocket no ficheiro `App.jsx` de `localhost` para o teu IP local.

---

## 🔮 Funcionalidades Futuras Planeadas

* [ ] Painel de Condições Meteorológicas (Temperatura da pista, ar e probabilidade de chuva).
* [ ] Alertas visuais de Status da Pista (Safety Car, Virtual Safety Car, Bandeiras Amarelas/Vermelhas).
* [ ] Visualização de Tempos de Setor em tempo real do piloto selecionado.

---

**Desenvolvido com 🏁 por Fãs de F1.**