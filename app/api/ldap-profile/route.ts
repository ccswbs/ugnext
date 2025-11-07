import { NextResponse } from 'next/server';
import { Client } from 'ldapts';

export const runtime = 'nodejs';

const getFirst = (value: any): string | null => {
  if (Array.isArray(value)) return value[0] || null;
  return typeof value === 'string' ? value : null;
};

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
  }

  const diagnostics: string[] = [];

  diagnostics.push(`Environment check: LDAP_URL=${process.env.LDAP_URL ? 'SET' : 'NOT SET'}`);
  diagnostics.push(`Environment check: LDAP_BIND_DN=${process.env.LDAP_BIND_DN ? 'SET' : 'NOT SET'}`);
  diagnostics.push(`Environment check: LDAP_BASE_DN=${process.env.LDAP_BASE_DN ? 'SET' : 'NOT SET'}`);
  diagnostics.push(`Environment check: LDAP_PASSWORD=${process.env.LDAP_PASSWORD ? 'SET' : 'NOT SET'}`);

  if (!process.env.LDAP_URL || !process.env.LDAP_BIND_DN || !process.env.LDAP_PASSWORD || !process.env.LDAP_BASE_DN) {
    return NextResponse.json({
      error: 'Missing LDAP environment variables',
      diagnostics
    }, { status: 500 });
  }

  const client = new Client({
    url: process.env.LDAP_URL,
    tlsOptions: { rejectUnauthorized: false }
  });

  try {
    await client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_PASSWORD);
    diagnostics.push('✓ LDAP bind successful');

    const searchStrategies = [
      { filter: `(uid=${uid})`, baseDN: process.env.LDAP_BASE_DN },
      { filter: `(mail=${uid}@uoguelph.ca)`, baseDN: process.env.LDAP_BASE_DN }
    ];

    for (let i = 0; i < searchStrategies.length; i++) {
      const strategy = searchStrategies[i];

      try {
        const { searchEntries } = await client.search(strategy.baseDN, {
          scope: 'sub',
          filter: strategy.filter,
          attributes: [
            'mail', 'telephonenumber', 'roomnumber', 'ou',
            'uid', 'cn', 'displayname', 'givenname', 'sn'
          ],
          sizeLimit: 1
        });

        if (searchEntries.length > 0) {
          const entry = searchEntries[0];
          const mail = getFirst(entry.mail);
          const telephoneNumber = getFirst(entry.telephonenumber);
          const telephoneNumber2 = getFirst(entry.telephonenumber2);
          const roomNumber = getFirst(entry.roomnumber);
          const ou = getFirst(entry.ou);

          await client.unbind();

          return NextResponse.json({
            mail,
            telephoneNumber,
            telephoneNumber2,
            roomNumber,
            ou,
            diagnostics
          });
        }
      } catch (searchError: any) {
        // Continue to next strategy if this one fails
      }
    }

    await client.unbind();

    return NextResponse.json({
      error: 'No entry found'
    }, { status: 404 });

  } catch (err: any) {
    return NextResponse.json({
      error: 'LDAP bind failed'
    }, { status: 500 });
  }
}
