// app/api/profiles/route.ts
import { NextResponse } from 'next/server';
import { getProfiles, getProfilesByUnit, getProfilesByType } from '@/data/drupal/profile';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const unit = searchParams.get('unit');
  const profileType = searchParams.get('profileType');

  let data;
  if (unit) {
    data = await getProfilesByUnit(unit);
  } else if (profileType) {
    data = await getProfilesByType(profileType);
  } else {
    data = await getProfiles();
  }

  const results = data?.results || [];
  return NextResponse.json(results);
}
