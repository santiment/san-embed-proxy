import request from 'supertest'
import createApp from '../src/app'

const app = createApp()

afterEach(() => {
	jest.restoreAllMocks()
})

describe('GET /health', () => {
	it('responds with 200', async () => {
		const res = await request(app).get('/health')

		expect(res.status).toBe(200)
		expect(res.body).toEqual({ status: 'ok' })
	})
})

describe('CORS', () => {
	it('allows listed origins', async () => {
		const res = await request(app).get('/health').set('Origin', 'https://embed.santiment.net')

		expect(res.status).toBe(200)
		expect(res.headers['access-control-allow-origin']).toBe('https://embed.santiment.net')
	})

	it('rejects unknown origins with 403', async () => {
		const res = await request(app).post('/graphql').set('Origin', 'https://evil.example.com').send({ query: '{}' })

		expect(res.status).toBe(403)
	})
})

describe('POST /graphql', () => {
	it('forwards the request to the Santiment API with the API key', async () => {
		process.env.SAN_API_KEY = 'test-key'
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { ok: true } }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		)

		const res = await request(app).post('/graphql').send({ query: '{ projects { slug } }' })

		expect(res.status).toBe(200)
		expect(res.body).toEqual({ data: { ok: true } })
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.santiment.net/graphql',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ query: '{ projects { slug } }' }),
				headers: expect.objectContaining({ Authorization: 'Apikey test-key' }),
			}),
		)
	})

	it('passes upstream errors through', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('rate limited', { status: 429, headers: { 'Content-Type': 'text/plain' } }),
		)

		const res = await request(app).post('/graphql').send({ query: '{}' })

		expect(res.status).toBe(429)
		expect(res.text).toBe('rate limited')
	})

	it('responds with 500 when the upstream request fails', async () => {
		jest.spyOn(global, 'fetch').mockRejectedValue(new Error('connection refused'))

		const res = await request(app).post('/graphql').send({ query: '{}' })

		expect(res.status).toBe(500)
	})
})
