// Tiny fetch wrapper for the invitation API.
const getHeaders = (extra = {}) => {
  const token = localStorage.getItem('token')
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const json = async (res) => {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Нещо се обърка 😬')
  return data
}

// Accepts { senderName, recipientName, recipientGender, kind, message, photo?, audio? }.
// Always sent as multipart/form-data so optional photo/voice blobs can ride along.
export const createInvitation = ({ photo, audio, ...fields }) => {
  const fd = new FormData()
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ''))
  if (photo) fd.append('photo', photo, photo.name || 'photo')
  if (audio) fd.append('audio', audio, audio.name || 'voice.webm')
  return fetch('/api/invitations', {
    method: 'POST',
    headers: getHeaders(),
    body: fd,
  }).then(json)
}

export const getInvitation = (id) =>
  fetch(`/api/invitations/${id}`).then(json)

export const saveResponse = (id, payload) =>
  fetch(`/api/invitations/${id}/response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(json)

export const registerUser = (username, password) =>
  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(json)

export const loginUser = (username, password) =>
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(json)

export const getMe = () =>
  fetch('/api/auth/me', {
    method: 'GET',
    headers: getHeaders(),
  }).then(json)

export const getUserInvitations = () =>
  fetch('/api/user/invitations', {
    method: 'GET',
    headers: getHeaders(),
  }).then(json)
