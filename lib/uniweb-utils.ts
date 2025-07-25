export interface UniwebProfile {
  membership_information: Array<{
    id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    account_type: [string, string];
    position_title: [string, string, string];
    academic_unit: [string, string, string, string];
    email: string;
    telephone: string | null;
    office: string | null;
    homepage: string | null;
    orcid: string | null;
    gscholar_profile: string | null;
    visibility: [string, string];
    _attributes_: any[];
  }>;
  research_interests: Array<{
    id: string;
    order: string;
    interest: [string, string, string]; // [id, name, category]
    description: string | null;
    _attributes_: any[];
  }>;
  // Add other top-level fields as needed when you discover them
}

export async function getProfile(id: string): Promise<UniwebProfile> {
  const baseUrl = process.env.NEXT_PUBLIC_UNIWEB_URL;
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_UNIWEB_URL environment variable is not set");
  }
  
  // Use the public profiles endpoint
  const url = `${baseUrl}/profiles.php/get/members/profile/${id}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch profile with id ${id}. Status: ${res.status}`);
  }
  
  return res.json();
}
