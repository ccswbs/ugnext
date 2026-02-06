import { NextRequest, NextResponse } from "next/server";
import { fetchAadProfile } from "@/lib/aad-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Only allow @uoguelph.ca emails for security
    if (!email.endsWith('@uoguelph.ca')) {
      return NextResponse.json({ error: 'Only @uoguelph.ca emails are allowed' }, { status: 403 });
    }

    // Fetch AAD data using server-side authentication
    const aadData = await fetchAadProfile(email);
    
    // Return only the contact information fields (no sensitive data)
    const contactInfo = {
      mail: aadData?.mail || null,
      businessPhones: aadData?.businessPhones || null,
      mobilePhone: aadData?.mobilePhone || null,
      officeLocation: aadData?.officeLocation || null
    };

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error in public contact API:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
  }
}