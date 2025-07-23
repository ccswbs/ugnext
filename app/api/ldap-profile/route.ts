import { NextResponse } from 'next/server';
import { Client } from 'ldapts';

export const runtime = 'nodejs';

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

  {/*   if (process.env.LDAP_URL) {
    diagnostics.push(`LDAP_URL length: ${process.env.LDAP_URL.length} chars`);
    diagnostics.push(`LDAP_URL starts with: ${process.env.LDAP_URL.substring(0, 10)}...`);
  }
  if (process.env.LDAP_BIND_DN) {
    diagnostics.push(`LDAP_BIND_DN length: ${process.env.LDAP_BIND_DN.length} chars`);
    diagnostics.push(`LDAP_BIND_DN value: ${process.env.LDAP_BIND_DN}`);
  }
  if (process.env.LDAP_BASE_DN) {
    diagnostics.push(`LDAP_BASE_DN length: ${process.env.LDAP_BASE_DN.length} chars`);
    diagnostics.push(`LDAP_BASE_DN value: ${process.env.LDAP_BASE_DN}`);
  }
  if (process.env.LDAP_PASSWORD) {
    diagnostics.push(`LDAP_PASSWORD length: ${process.env.LDAP_PASSWORD.length} chars`);
    diagnostics.push(`LDAP_PASSWORD starts with: ${process.env.LDAP_PASSWORD.substring(0, 3)}...`);
  } */}

  if (!process.env.LDAP_URL || !process.env.LDAP_BIND_DN || !process.env.LDAP_PASSWORD || !process.env.LDAP_BASE_DN) {
    diagnostics.push('✗ Critical LDAP environment variables are missing!');
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
    diagnostics.push('✓ LDAP client connected successfully to server');
    diagnostics.push('✓ LDAP bind successful');
    diagnostics.push('Skipping root permission test - proceeding directly to user search');

    const searchStrategies = [
      { filter: `(uid=${uid})`, description: 'Standard uid search', baseDN: 'ou=People,o=uoguelph.ca' },
      { filter: `(uid=${uid})`, description: 'Standard uid search (env variable)', baseDN: process.env.LDAP_BASE_DN },
      { filter: `(mail=${uid}@uoguelph.ca)`, description: 'Email exact search', baseDN: 'ou=People,o=uoguelph.ca' }
    ];

    for (let i = 0; i < searchStrategies.length; i++) {
      const strategy = searchStrategies[i];
      diagnostics.push(`Trying strategy ${i + 1}: ${strategy.description}`);
      diagnostics.push(`Search filter: ${strategy.filter}`);
      diagnostics.push(`Search base DN: ${strategy.baseDN}`);

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

        diagnostics.push(`Strategy ${i + 1} completed with ${searchEntries.length} entries`);
        diagnostics.push(`Search result status: ${searchEntries.length > 0 ? 'success' : 'no results'}`);

        if (searchEntries.length > 0) {
          const entry = searchEntries[0];
          const mail = entry.mail || null;
          const telephoneNumber = entry.telephonenumber || null;
          const roomNumber = entry.roomnumber || null;
          const ou = entry.ou || null;

          diagnostics.push(`✓ Successfully found data using: ${strategy.description}`);
          diagnostics.push(`Retrieved data: mail=${mail}, phone=${telephoneNumber}, room=${roomNumber}, ou=${ou}`);

          await client.unbind();

          return NextResponse.json({
            mail,
            telephoneNumber,
            roomNumber,
            ou,
            diagnostics,
            foundWith: strategy.description,
            fullEntry: entry
          });
        }
      } catch (searchError: any) {
        diagnostics.push(`✗ Strategy ${i + 1} search error: ${searchError.message}`);
        if (searchError.code) {
          diagnostics.push(`Error code: ${searchError.code}`);
        }
      }
    }

    diagnostics.push('All searches failed. This could indicate:');
    diagnostics.push('1. The user does not exist in the LDAP directory');
    diagnostics.push('2. Insufficient search permissions for the bind user');
    diagnostics.push('3. Network connectivity issues between Netlify and LDAP server');
    diagnostics.push('4. Different LDAP server configuration between local and production');

    await client.unbind();

    return NextResponse.json({
      error: 'No entry found with any search strategy',
      diagnostics,
      troubleshooting: {
        bindSuccessful: true,
        connectionSuccessful: true,
        permissionTestPassed: true,
        searchesAttempted: searchStrategies.length,
        recommendedAction: 'Verify user exists in LDAP directory'
      }
    }, { status: 404 });

  } catch (err: any) {
    diagnostics.push(`✗ LDAP bind failed: ${err.message}`);
    if (err.code) {
      diagnostics.push(`Error code: ${err.code}`);
    }

    return NextResponse.json({
      error: 'LDAP bind failed',
      diagnostics
    }, { status: 500 });
  }
}
