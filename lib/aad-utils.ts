type AadProfile = {
  mail: string | null;
  mobilePhone: string | null;
  businessPhones: string[] | null;
  officeLocation: string | null;
  department: string | null;
  id?: string | null;
  displayName?: string | null;
  givenName?: string | null;
  surname?: string | null;
  jobTitle?: string | null;
  userPrincipalName?: string | null;
};

const getFirst = (value: any): string | null => {
  if (Array.isArray(value)) return value[0] || null;
  return typeof value === 'string' ? value : null;
};

export async function fetchAadProfile(email: string): Promise<AadProfile | null> {
  if (!process.env.AZURE_AD_TENANT_ID || !process.env.AZURE_AD_CLIENT_ID || !process.env.AZURE_AD_CLIENT_SECRET) {
    console.warn('Missing Azure AD environment variables');
    return null;
  }

  try {
    // Get access token
    const tokenRes = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    });

    if (!tokenRes.ok) {
      const tokenError = await tokenRes.json();
      console.warn('AAD token request failed:', tokenError);
      return null;
    }

    const { access_token } = await tokenRes.json();

    // First try to get user directly by email (userPrincipalName)
    let graphRes = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // If direct lookup fails, try searching by mail attribute
    if (!graphRes.ok && graphRes.status === 404) {
      console.log(`Direct AAD lookup failed for ${email}, trying search...`);
      
      const searchUrl = `https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}' or userPrincipalName eq '${email}'&$select=id,displayName,mail,userPrincipalName,givenName,surname,jobTitle,department,officeLocation,mobilePhone,businessPhones`;
      
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!searchRes.ok) {
        const searchError = await searchRes.json();
        console.warn('AAD search request failed:', searchError);
        return null;
      }

      const searchResult = await searchRes.json();
      
      if (!searchResult.value || searchResult.value.length === 0) {
        console.log(`No AAD user found with email: ${email}`);
        return null;
      }

      // Use the first matching user
      const user = searchResult.value[0];
      
      // Map Microsoft Graph user properties to our profile structure
      return {
        mail: user.mail || user.userPrincipalName || null,
        mobilePhone: user.mobilePhone || null,
        businessPhones: user.businessPhones && user.businessPhones.length > 0 ? user.businessPhones : null,
        officeLocation: user.officeLocation || null,
        department: user.department || null,
        id: user.id || null,
        displayName: user.displayName || null,
        givenName: user.givenName || null,
        surname: user.surname || null,
        jobTitle: user.jobTitle || null,
        userPrincipalName: user.userPrincipalName || null
      };
    }

    if (!graphRes.ok) {
      console.warn('AAD Graph API error:', graphRes.status, graphRes.statusText);
      return null;
    }

    const user = await graphRes.json();
    
    // Map Microsoft Graph user properties to our profile structure
    return {
      mail: user.mail || user.userPrincipalName || null,
      mobilePhone: user.mobilePhone || null,
      businessPhones: user.businessPhones && user.businessPhones.length > 0 ? user.businessPhones : null,
      officeLocation: user.officeLocation || null,
      department: user.department || null,
      id: user.id || null,
      displayName: user.displayName || null,
      givenName: user.givenName || null,
      surname: user.surname || null,
      jobTitle: user.jobTitle || null,
      userPrincipalName: user.userPrincipalName || null
    };

  } catch (err: any) {
    console.warn('AAD error:', err.message);
    return null;
  }
}