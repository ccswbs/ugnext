import { Client } from 'ldapts';

type LdapProfile = {
  mail: string | null;
  telephoneNumber: string | null;
  telephoneNumber2: string | null;
  roomNumber: string | null;
  ou: string | null;
  uid?: string | null;
  cn?: string | null;
  displayName?: string | null;
  givenName?: string | null;
  sn?: string | null;
};

const getFirst = (value: any): string | null => {
  if (Array.isArray(value)) return value[0] || null;
  return typeof value === 'string' ? value : null;
};

export async function fetchLdapProfile(uid: string): Promise<LdapProfile | null> {
  if (!process.env.LDAP_URL || !process.env.LDAP_BIND_DN || !process.env.LDAP_PASSWORD || !process.env.LDAP_BASE_DN) {
    console.warn('Missing LDAP environment variables');
    return null;
  }

  const client = new Client({
    url: process.env.LDAP_URL,
    tlsOptions: { rejectUnauthorized: false }
  });

  try {
    await client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_PASSWORD);

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
            'mail', 'telephonenumber', 'telephonenumber2', 'roomnumber', 'ou',
            'uid', 'cn', 'displayname', 'givenname', 'sn'
          ],
          sizeLimit: 1
        });

        if (searchEntries.length > 0) {
          const entry = searchEntries[0];
          await client.unbind();

          return {
            mail: getFirst(entry.mail),
            telephoneNumber: getFirst(entry.telephonenumber),
            telephoneNumber2: getFirst(entry.telephonenumber2),
            roomNumber: getFirst(entry.roomnumber),
            ou: getFirst(entry.ou),
            uid: getFirst(entry.uid),
            cn: getFirst(entry.cn),
            displayName: getFirst(entry.displayname),
            givenName: getFirst(entry.givenname),
            sn: getFirst(entry.sn)
          };
        }
      } catch (searchError: any) {
        // Search strategy failed, continue to next strategy
      }
    }

    await client.unbind();
    return null;

  } catch (err: any) {
    console.warn('LDAP error:', err.message);
    return null;
  }
}
