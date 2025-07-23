import { NextResponse } from 'next/server';
import ldap from 'ldapjs';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
  }

  const diagnostics: string[] = [];
  
  return new Promise<Response>((resolve) => {
    diagnostics.push(`Environment check: LDAP_URL=${process.env.LDAP_URL ? 'SET' : 'NOT SET'}`);
    diagnostics.push(`Environment check: LDAP_BIND_DN=${process.env.LDAP_BIND_DN ? 'SET' : 'NOT SET'}`);
    diagnostics.push(`Environment check: LDAP_BASE_DN=${process.env.LDAP_BASE_DN ? 'SET' : 'NOT SET'}`);
    
    const client = ldap.createClient({
      url: process.env.LDAP_URL!,
      tlsOptions: { rejectUnauthorized: false },
    });

    // Add connection event listeners to detect network issues
    client.on('connect', () => {
      diagnostics.push('✓ LDAP client connected successfully to server');
    });

    client.on('connectError', (err: any) => {
      diagnostics.push(`✗ LDAP connection error: ${err.message}`);
      diagnostics.push('This likely indicates a network/firewall issue - Netlify may not be whitelisted');
      resolve(NextResponse.json({ 
        error: 'LDAP connection failed - network issue', 
        diagnostics 
      }, { status: 500 }));
    });

    client.on('error', (err: any) => {
      diagnostics.push(`✗ LDAP client error: ${err.message}`);
    });

    // Add a timeout to detect hanging connections
    const connectionTimeout = setTimeout(() => {
      diagnostics.push('✗ LDAP connection timeout (10s) - likely network/firewall blocking');
      client.unbind();
      resolve(NextResponse.json({ 
        error: 'LDAP connection timeout - network blocked', 
        diagnostics 
      }, { status: 500 }));
    }, 10000); // 10 second timeout

    client.bind(process.env.LDAP_BIND_DN!, process.env.LDAP_PASSWORD!, (err: any) => {
      clearTimeout(connectionTimeout); // Clear timeout if we get a response
      
      if (err) {
        diagnostics.push(`✗ LDAP bind failed: ${err.message}`);
        if (err.code) {
          diagnostics.push(`Error code: ${err.code}`);
        }
        
        // Check for specific network-related error codes
        if (err.code === 'ECONNREFUSED') {
          diagnostics.push('Analysis: Connection refused - server not reachable or port blocked');
        } else if (err.code === 'ETIMEDOUT') {
          diagnostics.push('Analysis: Connection timed out - likely firewall blocking');
        } else if (err.code === 'ENOTFOUND') {
          diagnostics.push('Analysis: DNS resolution failed - hostname not found');
        } else if (err.code === 'ECONNRESET') {
          diagnostics.push('Analysis: Connection reset - server dropped connection (possibly firewall)');
        }
        
        resolve(NextResponse.json({ 
          error: 'LDAP bind failed', 
          diagnostics 
        }, { status: 500 }));
        return;
      }

      diagnostics.push('✓ LDAP bind successful');

      const opts = {
        filter: `(uid=${uid})`,
        scope: 'sub' as const,
        attributes: ['mail', 'telephonenumber', 'roomnumber', 'ou'],
      };

      diagnostics.push(`Starting LDAP search with filter: ${opts.filter}`);
      diagnostics.push(`Search base DN: ${process.env.LDAP_BASE_DN}`);

      client.search(process.env.LDAP_BASE_DN!, opts, (err: any, res: any) => {
        if (err) {
          diagnostics.push(`✗ LDAP search initiation error: ${err.message}`);
          client.unbind();
          resolve(NextResponse.json({ 
            error: 'LDAP search failed to start', 
            diagnostics 
          }, { status: 500 }));
          return;
        }
        
        const entries: any[] = [];

        res.on('searchEntry', (entry: any) => {
          diagnostics.push('✓ LDAP search entry found!');

          if (entry?.object) {
            entries.push(entry.object);
          } else if (entry?.attributes) {
            const result: Record<string, string> = {};
            entry.attributes.forEach((attr: any) => {
              result[attr.type] = attr.vals?.[0] || null;
            });
            entries.push(result);
          }
        });

        res.on('searchReference', (referral: any) => {
          diagnostics.push(`LDAP search referral received: ${referral}`);
        });

        res.on('error', (err: any) => {
          diagnostics.push(`✗ LDAP search error: ${err.message}`);
          client.unbind();
          resolve(NextResponse.json({ 
            error: 'LDAP search failed', 
            diagnostics 
          }, { status: 500 }));
        });

        res.on('end', (result: any) => {
          diagnostics.push(`LDAP search completed with status: ${result?.status || 'unknown'}`);
          diagnostics.push(`Total entries found: ${entries.length}`);
          client.unbind();

          if (entries.length === 0) {
            diagnostics.push(`✗ No LDAP entry found for uid=${uid}`);
            diagnostics.push('Possible causes:');
            diagnostics.push('- The uid does not exist in the LDAP directory');
            diagnostics.push('- The uid exists but not in the search base DN');
            diagnostics.push('- The search filter is not matching the entry format');
            diagnostics.push('- Insufficient permissions to read the entry');
            
            resolve(NextResponse.json({ 
              error: 'No entry found', 
              diagnostics 
            }, { status: 404 }));
            return;
          }

          const entry = entries[0];
          const mail = entry.mail || null;
          const telephoneNumber = entry.telephonenumber || null;
          const roomNumber = entry.roomnumber || null;
          const ou = entry.ou || null;

          diagnostics.push('✓ Successfully retrieved LDAP data');

          resolve(NextResponse.json({ 
            mail, 
            telephoneNumber, 
            roomNumber, 
            ou, 
            diagnostics 
          }));
        });
      });
    });
  });
}
