import { NextRequest, NextResponse } from "next/server";
import { fetchAadProfile } from "@/lib/aad-utils";
import { ValidationService, createValidationErrorResponse } from "@/lib/validation-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawEmail = searchParams.get('email');

    // Validate and sanitize email using shared utility
    const { email: validatedEmail, validation } = ValidationService.processEmail(rawEmail, {
      requireDomain: '@uoguelph.ca'
    });
    
    if (!validation.valid || !validatedEmail) {
      return createValidationErrorResponse(validation.error!);
    }

    // Fetch AAD data using server-side authentication
    const aadData = await fetchAadProfile(validatedEmail);
    
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