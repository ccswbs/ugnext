import { Client } from 'ldapts';

export const runtime = 'nodejs';

type LdapProfile = {
  mail: string | null;
  telephoneNumber: string | null;
  roomNumber: string | null;
  ou: string | null;
  uid?: string | null;
  cn?: string | null;
  displayName?: string | null;
  givenName?: string | null;
  sn?: string | null;
  diagnostics?: string[];
};

export async function fetchLdapProfile(uid: string): Promise<LdapProfile | null> {
  const diagnostics: string[] = [];

  diagnostics.push(`Environment check: LDAP_URL=${process.env.LDAP_URL ? 'SET' : 'NOT SET'}`);
  diagnostics.push(`Environment check: LDAP_BIND_DN=${process.env.LDAP_BIND_DN ? 'SET' : 'NOT SET'}`);
  diagnostics.push(`Environment check: LDAP_BASE_DN=${process.env.LDAP_BASE_DN ? 'SET' : 'NOT SET'}`);
  diagnostics.push(`Environment check: LDAP_PASSWORD=${process.env.LDAP_PASSWORD ? 'SET' : 'NOT SET'}`);

  if (!process.env.LDAP_URL || !process.env.LDAP_BIND_DN || !process.env.LDAP_PASSWORD || !process.env.LDAP_BASE_DN) {
    console.warn('Missing LDAP environment variables', diagnostics);
    return null;
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
          await client.unbind();

          return {
            mail: entry.mail || null,
            telephoneNumber: entry.telephonenumber || null,
            roomNumber: entry.roomnumber || null,
            ou: entry.ou || null,
            uid: entry.uid || null,
            cn: entry.cn || null,
            displayName: entry.displayname || null,
            givenName: entry.givenname || null,
            sn: entry.sn || null,
            diagnostics
          };
        }
      } catch (searchError: any) {
        diagnostics.push(`Search strategy ${i} failed: ${searchError.message}`);
      }
    }

    await client.unbind();
    diagnostics.push('No LDAP entry found');
    return null;

  } catch (err: any) {
    diagnostics.push(`LDAP bind failed: ${err.message}`);
    console.warn('LDAP error:', diagnostics);
    return null;
  }
}
