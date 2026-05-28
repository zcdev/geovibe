export default async function handler(req, res) {
    const {
      dataset = '2024/acs/acsse',
      get,
      for: geo,
    } = req.query
  
    const url =
      `https://api.census.gov/data/${dataset}` +
      `?get=${get}` +
      `&for=${geo}` +
      `&key=${process.env.CENSUS_API_KEY}`
  
    try {
      const response = await fetch(url)
      const data = await response.json()
  
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ error: 'Census fetch failed' })
    }
}