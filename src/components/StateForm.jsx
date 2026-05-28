export default function StateForm({ stateQuery, setStateQuery, setStateData, setError }) {
    // List of all 50 US states for autocomplete and autofill
    const US_STATES = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana","Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]

    // US Census 2023 ACS data GET request URL
    const CENSUS_DATA = 'NAME,K200101_001E,K201905_001E,K200103_001E,K200101_002E,K200101_003E,K200201_002E,K200201_003E,K200201_004E,K200201_005E,K200201_006E,K200301_003E,K200201_007E,K200201_001E'

    // Handle form submission
    async function handleSubmit(event) {

        event.preventDefault()

        try {
            // Fetch data from Census API
            const response = await fetch(
                '/api/census?' +
                new URLSearchParams({
                  get: CENSUS_DATA,
                  for: 'state:*',
                })
            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const states = data.slice(1) // Remove headers at data tables
            const match = states.find(row => row[0].toLowerCase() === stateQuery.toLowerCase().trim())

            // Check user input and handle error messages
            if (match) {
                setStateData(match)
                setStateQuery('')
                setError('')
            } else {
                setError('We couldn’t find that state. Please try again.')
            }

            // console.log('User submitted:', stateQuery)

        } catch (error) {

            setError('Unable to load data at this time.')
            // console.error('An error occurred:', error)

        }
    }

    return (
        <form className="state-form" onSubmit={handleSubmit}>
            <input
                name="state"
                placeholder="Enter your state"
                aria-label="Enter your state"
                type="text"
                list="states"
                autoComplete="address-level1"
                value={stateQuery}
                onChange={(event) => setStateQuery(event.target.value)}
            />
            <datalist id="states">
                {US_STATES.map((state) => (
                    <option key={state} value={state} />
                ))}
            </datalist>
            <button type="submit">Submit</button>
        </form>
    )
}