export interface LdapProfile {
  mail?: string | null;
  telephoneNumber?: string | null;
  roomNumber?: string | null;
  ou?: string | null;
  error?: string;
}

export async function fetchLdapProfile(uid: string): Promise<LdapProfile | null> {
  try {
    // Dynamically construct the full URL for server-side fetch
    // Use HTTP for localhost/development, HTTPS for production domains
    const host = process.env.URL || 'localhost:3000';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const protocol = isLocalhost ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/ldap-profile?uid=${encodeURIComponent(uid)}`);
    
    if (!response.ok) {
      console.warn(`LDAP fetch failed for uid ${uid}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Error fetching LDAP profile for uid ${uid}:`, error);
    return null;
  }
}
