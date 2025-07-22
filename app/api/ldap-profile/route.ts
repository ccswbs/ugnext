import { NextResponse } from 'next/server';
import ldap from 'ldapjs';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
  }

  return new Promise<Response>((resolve) => {
    console.log('LDAP_URL:', process.env.LDAP_URL ? 'SET' : 'NOT SET');
    console.log('LDAP_BIND_DN:', process.env.LDAP_BIND_DN ? 'SET' : 'NOT SET');
    console.log('LDAP_BASE_DN:', process.env.LDAP_BASE_DN ? 'SET' : 'NOT SET');
    
    const client = ldap.createClient({
      url: process.env.LDAP_URL!,
      tlsOptions: { rejectUnauthorized: false },
    });

    client.bind(process.env.LDAP_BIND_DN!, process.env.LDAP_PASSWORD!, (err: any) => {
      if (err) {
        console.error('LDAP bind error:', err);
        resolve(NextResponse.json({ error: 'LDAP bind failed' }, { status: 500 }));
        return;
      }

      console.log('LDAP bind successful');

      const opts = {
        filter: `(uid=${uid})`,
        scope: 'sub' as const,
        attributes: ['mail', 'telephonenumber', 'roomnumber', 'ou'],
      };

      console.log('Starting LDAP search with filter:', opts.filter);
      console.log('Search base DN:', process.env.LDAP_BASE_DN);

      client.search(process.env.LDAP_BASE_DN!, opts, (err: any, res: any) => {
        if (err) {
          console.error('LDAP search initiation error:', err);
          client.unbind();
          resolve(NextResponse.json({ error: 'LDAP search failed to start' }, { status: 500 }));
          return;
        }
        
        const entries: any[] = [];

        res.on('searchEntry', (entry: any) => {
          console.log('LDAP search entry found!');
          console.log('Raw LDAP entry:', entry);

          if (entry?.object) {
            console.log('LDAP entry object:', entry.object);
            entries.push(entry.object);
          } else if (entry?.attributes) {
            const result: Record<string, string> = {};
            entry.attributes.forEach((attr: any) => {
              result[attr.type] = attr.vals?.[0] || null;
            });
            console.log('Manually built entry:', result);
            entries.push(result);
          } else {
            console.warn('LDAP entry received but no usable data:', entry);
          }
        });

        res.on('searchReference', (referral: any) => {
          console.log('LDAP search referral:', referral);
        });

        res.on('error', (err: any) => {
          console.error('LDAP search error:', err);
          client.unbind();
          resolve(NextResponse.json({ error: 'LDAP search failed' }, { status: 500 }));
        });

        res.on('end', (result: any) => {
          console.log('LDAP search ended with status:', result?.status);
          console.log('Total entries found:', entries.length);
          console.log('Search result object:', result);
          client.unbind();

          if (entries.length === 0) {
            console.warn(`No LDAP entry found for uid=${uid}`);
            console.warn('This could mean:');
            console.warn('1. The uid does not exist in the LDAP directory');
            console.warn('2. The uid exists but not in the search base DN');
            console.warn('3. The search filter is not matching the entry format');
            console.warn('4. Insufficient permissions to read the entry');
            resolve(NextResponse.json({ error: 'No entry found' }, { status: 404 }));
            return;
          }

          const entry = entries[0];
          console.log('Using first entry:', entry);
          const mail = entry.mail || null;
          const telephoneNumber = entry.telephonenumber || null;
          const roomNumber = entry.roomnumber || null;
          const ou = entry.ou || null;

          resolve(NextResponse.json({ mail, telephoneNumber, roomNumber, ou }));
        });
      });
    });
  });
}
