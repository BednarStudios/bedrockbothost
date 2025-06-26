require('./server.js');
const { createClient } = require('bedrock-protocol');

const options = {
  host: 'survalistinc.aternos.me',
  port: 42507,
  username: 'ServerADM',
  offline: true,
  version: '1.21.70'
};

let client;
let startTime = Date.now();

function getOnlineTime() {
  const ms = Date.now() - startTime;
  const s = Math.floor((ms / 1000) % 60);
  const m = Math.floor((ms / (1000 * 60)) % 60);
  const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${h}h ${m}m ${s}s`;
}

function sendChat(message) {
  if (typeof message !== 'string' || message.trim() === '') return;

  try {
    client.queue('text', {
      type: 'chat',
      needs_translation: false,
      source_name: String(client?.options?.username || ''),
      xuid: '',
      platform_chat_id: '',
      message: String(message)
    });
  } catch (err) {
    console.error('❌ Erro ao enviar mensagem:', err);
  }
}

function startBot() {
  console.log('Conectando como ServerADM...');

  client = createClient(options);

  client.on('join', () => {
    console.log('✅ Bot entrou no servidor!');
    sendChat('§b[i] §fServerADM §aagora está online! ✅');
  });

  client.on('text', (packet) => {
    if (!packet || typeof packet.message !== 'string') return;

    const msg = packet.message.toLowerCase();
    const sender = packet.source_name || 'Jogador';

    if (msg.includes('joined the game')) {
      const name = packet.message.split(' ')[0];
      sendChat(`§6[i] §e>> §b${name} §ajoined the game`);
    }

    if (msg.includes('left the game')) {
      const name = packet.message.split(' ')[0];
      sendChat(`§6[i] §c<< §b${name} §cleft the game`);
    }

    if (msg === '!ping') {
      sendChat('🏓 Pong!');
    }

    if (msg === '!help') {
      sendChat('📋 Comandos: !ping, !status, !time, !players, !help');
    }

    if (msg === '!status') {
      sendChat('📡 Bot online e funcional!');
    }

    if (msg === '!time') {
      const time = getOnlineTime();
      sendChat(`⏱ Online há: ${time}`);
    }

    if (msg === '!players') {
      const playerList = client?.players ? Object.keys(client.players).join(', ') : 'Desconhecido';
      sendChat(`👥 Jogadores (parcial): ${playerList}`);
    }
  });

  client.on('disconnect', (reason) => {
    console.log('⛔ Bot desconectado:', reason);
    console.log('🔁 Reconectando em 5 segundos...');
    setTimeout(startBot, 5000);
  });

  client.on('error', (err) => {
    console.error('❌ Erro:', err);
  });
}

startBot();
