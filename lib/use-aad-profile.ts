import { useState, useEffect } from 'react';

interface AadData {
  mail: string | null;
  mobilePhone: string | null;
  businessPhones: string[] | null;
  officeLocation: string | null;
  department: string | null;
  displayName?: string | null;
  givenName?: string | null;
  surname?: string | null;
  jobTitle?: string | null;
  userPrincipalName?: string | null;
}

interface UseAadProfileResult {
  data: AadData | null;
  loading: boolean;
  error: string | null;
}

export function useAadProfile(email: string | null, shouldFetch: boolean = true): UseAadProfileResult {
  const [data, setData] = useState<AadData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !shouldFetch) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const url = `/api/aad-profile?email=${encodeURIComponent(email)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        // Map the Microsoft Graph response to our interface
        setData({
          mail: result.mail || result.userPrincipalName || null,
          mobilePhone: result.mobilePhone || null,
          businessPhones: result.businessPhones && result.businessPhones.length > 0 ? result.businessPhones : null,
          officeLocation: result.officeLocation || null,
          department: result.department || null,
          displayName: result.displayName || null,
          givenName: result.givenName || null,
          surname: result.surname || null,
          jobTitle: result.jobTitle || null,
          userPrincipalName: result.userPrincipalName || null
        });
      } catch (err) {
        console.error('Error fetching AAD profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch AAD data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email, shouldFetch]);

  return { data, loading, error };
}