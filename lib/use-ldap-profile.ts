import { useState, useEffect } from 'react';

interface LdapData {
  mail: string | null;
  telephoneNumber: string | null;
  telephoneNumber2: string | null;
  roomNumber: string | null;
  ou: string | null;
}

interface UseLdapProfileResult {
  data: LdapData | null;
  loading: boolean;
  error: string | null;
}

export function useLdapProfile(uid: string | null, shouldFetch: boolean = true): UseLdapProfileResult {
  const [data, setData] = useState<LdapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !shouldFetch) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const url = `/api/ldap-profile?uid=${encodeURIComponent(uid)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        // The API returns the data directly, not nested under a 'data' property
        setData({
          mail: result.mail,
          telephoneNumber: result.telephoneNumber,
          telephoneNumber2: result.telephoneNumber2,
          roomNumber: result.roomNumber,
          ou: result.ou
        });
      } catch (err) {
        console.error('Error fetching LDAP profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch LDAP data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, shouldFetch]);

  return { data, loading, error };
}
