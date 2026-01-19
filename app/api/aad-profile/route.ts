// app/api/azure-profile/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

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
      console.error('Token request failed:', tokenError);
      return NextResponse.json({ 
        error: "Authentication failed",
        details: tokenError.error_description || 'Failed to get access token'
      }, { status: 401 });
    }

    const { access_token } = await tokenRes.json();

    // First try to get user directly by email (userPrincipalName)
    let graphRes = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // If direct lookup fails, try searching by mail attribute
    if (!graphRes.ok && graphRes.status === 404) {
      console.log(`Direct lookup failed for ${email}, trying search...`);
      
      const searchUrl = `https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}' or userPrincipalName eq '${email}'&$select=id,displayName,mail,userPrincipalName,givenName,surname,jobTitle,department,officeLocation,mobilePhone,businessPhones`;
      
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!searchRes.ok) {
        const searchError = await searchRes.json();
        console.error('Search request failed:', searchError);
        return NextResponse.json({ 
          error: "Search failed",
          details: searchError.error?.message || 'Failed to search for user'
        }, { status: searchRes.status });
      }

      const searchResult = await searchRes.json();
      
      if (!searchResult.value || searchResult.value.length === 0) {
        return NextResponse.json({ 
          error: "User not found",
          details: `No user found with email: ${email}`
        }, { status: 404 });
      }

      // Return the first matching user
      return NextResponse.json(searchResult.value[0]);
    }

    if (!graphRes.ok) {
      const graphError = await graphRes.json();
      console.error('Graph API error:', graphError);
      return NextResponse.json({ 
        error: "User lookup failed",
        details: graphError.error?.message || `HTTP ${graphRes.status}`
      }, { status: graphRes.status });
    }

    const user = await graphRes.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error('Unexpected error in AAD profile route:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}