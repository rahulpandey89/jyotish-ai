import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getPandits = () => api.get('/pandits')

export const consultPandit = (panditId, birthDetails, sawaal = null) =>
  api.post(`/consult/${panditId}`, { birth_details: birthDetails, pandit_id: panditId, sawaal })

export const getSummary = (birthDetails) =>
  api.post('/summary', { birth_details: birthDetails })

// SSE streaming for consult-all
export const consultAllStream = (birthDetails, onPandit, onDone, onError) => {
  // Use fetch for SSE
  fetch('/api/consult-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birth_details: birthDetails }),
  }).then((res) => {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    const read = () => {
      reader.read().then(({ done, value }) => {
        if (done) { onDone(); return }
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
        lines.forEach((line) => {
          try {
            const data = JSON.parse(line.replace('data: ', ''))
            if (data.done) { onDone(); return }
            if (data.error) { onError(data.error); return }
            onPandit(data)
          } catch (_) {}
        })
        read()
      })
    }
    read()
  }).catch(onError)
}
