const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY!;

/**
 * Fetch district suggestions using LocationIQ’s autocomplete API.
 * @param query - The district name or partial search string
 * @returns Promise<string[]> — list of district names
 */
export async function fetchDistrictSuggestions(query: string): Promise<string[]> {
  if (!query) return [];

  // Construct the API URL
  const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
    query
  )}&limit=10&countrycodes=in&normalizeaddress=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch districts: ${res.statusText}`);

    const data = await res.json();

    // Filter results for only district-level entities
    const districts = data
      .filter(
        (item: any) =>
          item.address && (item.address.county || item.address.state_district)
      )
      .map(
        (item: any) => item.address.county || item.address.state_district
      )
      .filter((value: string, index: number, self: string[]) => value && self.indexOf(value) === index);

    return districts;
  } catch (error) {
    console.error("Error fetching district suggestions:", error);
    return [];
  }
}
