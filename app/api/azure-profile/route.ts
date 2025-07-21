import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const tokenRes = await fetch(`https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET!,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });

  const { access_token } = await tokenRes.json();

  const graphRes = await fetch(`https://graph.microsoft.com/v1.0/users/${email}?$select=mail,officeLocation,mobilePhone`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!graphRes.ok) {
    return NextResponse.json({ error: "User not found" }, { status: graphRes.status });
  }

  const user = await graphRes.json();

  const sanitized = {
    email: user.mail,
    officeLocation: user.officeLocation,
    phone: user.mobilePhone,
  };

  return NextResponse.json(sanitized);
}

