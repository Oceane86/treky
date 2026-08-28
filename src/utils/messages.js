// Messagerie voyageur <-> guide, persistée en localStorage (même logique que
// treky_reservations : pas de backend, mais partagée entre les espaces voyageur
// et guide dans le même navigateur).

import { readJSON, writeJSON } from './storage'

const KEY = 'treky_conversations'

function conversationId(guideId, travelerEmail) {
  return `${guideId}::${travelerEmail}`
}

export function readConversations() {
  return readJSON(KEY, [])
}

export function getConversation(guideId, travelerEmail) {
  if (!travelerEmail) return null
  return readConversations().find((c) => c.id === conversationId(guideId, travelerEmail)) ?? null
}

export function getConversationsForGuide(guideId) {
  return readConversations()
    .filter((c) => c.guideId === guideId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

// Crée la conversation avec le message d'accueil du guide si elle n'existe pas encore.
export function ensureConversation(guideId, traveler, circuitName, greetingMessages) {
  const existing = getConversation(guideId, traveler.email)
  if (existing) return existing

  const all = readConversations()
  const conv = {
    id: conversationId(guideId, traveler.email),
    guideId,
    travelerEmail: traveler.email,
    travelerName: traveler.name,
    travelerAvatar: traveler.avatar ?? null,
    circuitName: circuitName ?? null,
    messages: greetingMessages,
    updatedAt: new Date().toISOString(),
    guideUnread: false,
    travelerUnread: false,
  }
  all.push(conv)
  writeJSON(KEY, all)
  return conv
}

export function appendMessage(guideId, traveler, circuitName, message) {
  const all = readConversations()
  const id = conversationId(guideId, traveler.email)
  const idx = all.findIndex((c) => c.id === id)
  const now = new Date().toISOString()
  const isFromGuide = message.from === 'guide'

  if (idx === -1) {
    all.push({
      id, guideId, travelerEmail: traveler.email, travelerName: traveler.name,
      travelerAvatar: traveler.avatar ?? null, circuitName: circuitName ?? null,
      messages: [message], updatedAt: now,
      guideUnread: !isFromGuide, travelerUnread: isFromGuide,
    })
  } else {
    all[idx] = {
      ...all[idx],
      circuitName: circuitName ?? all[idx].circuitName,
      messages: [...all[idx].messages, message],
      updatedAt: now,
      guideUnread: !isFromGuide ? true : all[idx].guideUnread,
      travelerUnread: isFromGuide ? true : all[idx].travelerUnread,
    }
  }
  writeJSON(KEY, all)
}

export function markGuideRead(guideId, travelerEmail) {
  const all = readConversations()
  const idx = all.findIndex((c) => c.id === conversationId(guideId, travelerEmail))
  if (idx === -1 || !all[idx].guideUnread) return
  all[idx] = { ...all[idx], guideUnread: false }
  writeJSON(KEY, all)
}

export function markTravelerRead(guideId, travelerEmail) {
  const all = readConversations()
  const idx = all.findIndex((c) => c.id === conversationId(guideId, travelerEmail))
  if (idx === -1 || !all[idx].travelerUnread) return
  all[idx] = { ...all[idx], travelerUnread: false }
  writeJSON(KEY, all)
}
