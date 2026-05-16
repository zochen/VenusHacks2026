// Tiny room-based broadcast relay for CapyConnect.
// Clients connect with ws://host:PORT/?room=ABC123&id=<clientId>
// Any JSON message they send is forwarded to every other client in the same room.

import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 8787);
const rooms = new Map(); // roomCode -> Set<ws>

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`[relay] listening on ws://0.0.0.0:${PORT}`);
});

wss.on('connection', (ws, req) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const room = (url.searchParams.get('room') ?? '').trim().toUpperCase();
  const clientId = url.searchParams.get('id') ?? randomUUID();

  if (!room) {
    ws.close(1008, 'missing room');
    return;
  }

  ws.roomCode = room;
  ws.clientId = clientId;

  let peers = rooms.get(room);
  if (!peers) {
    peers = new Set();
    rooms.set(room, peers);
  }
  peers.add(ws);

  const size = peers.size;
  console.log(`[relay] join room=${room} id=${clientId.slice(0, 6)} peers=${size}`);

  // Tell the joining client + existing peers about the new presence.
  broadcast(room, { type: '__presence', room, peers: size, joined: clientId });

  ws.on('message', (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch {
      return; // ignore non-JSON
    }
    // Stamp sender so receivers can ignore their own echoes if any.
    payload.__from = clientId;
    payload.__room = room;
    payload.__ts = Date.now();
    broadcast(room, payload, ws);
  });

  ws.on('close', () => {
    const set = rooms.get(room);
    if (!set) return;
    set.delete(ws);
    if (set.size === 0) {
      rooms.delete(room);
    } else {
      broadcast(room, { type: '__presence', room, peers: set.size, left: clientId });
    }
    console.log(`[relay] leave room=${room} id=${clientId.slice(0, 6)} peers=${set.size}`);
  });
});

function broadcast(room, payload, except) {
  const set = rooms.get(room);
  if (!set) return;
  const data = JSON.stringify(payload);
  for (const peer of set) {
    if (peer === except) continue;
    if (peer.readyState === peer.OPEN) peer.send(data);
  }
}
