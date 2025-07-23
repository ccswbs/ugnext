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

      // Try multiple search strategies
      const searchStrategies = [
        { filter: `(uid=${uid})`, description: 'Standard uid search', baseDN: 'ou=People,o=uoguelph.ca' },
        { filter: `(uid=${uid})`, description: 'Standard uid search (lowercase)', baseDN: 'ou=people,o=uoguelph.ca' },
        { filter: `(uid=${uid})`, description: 'Standard uid search (env variable)', baseDN: process.env.LDAP_BASE_DN! },
        { filter: `(cn=${uid})`, description: 'Common name search', baseDN: 'ou=People,o=uoguelph.ca' },
        { filter: `(edupersonprincipalname=${uid}@uoguelph.ca)`, description: 'EduPerson principal name search', baseDN: 'ou=People,o=uoguelph.ca' },
        { filter: `(displayname=*${uid}*)`, description: 'Display name search', baseDN: 'ou=People,o=uoguelph.ca' },
        { filter: `(mail=${uid}@uoguelph.ca)`, description: 'Email exact search', baseDN: 'ou=People,o=uoguelph.ca' },
        { filter: `(|(uid=${uid})(cn=${uid})(mail=${uid}@uoguelph.ca))`, description: 'Multi-attribute OR search', baseDN: 'ou=People,o=uoguelph.ca' }
      ];

      let strategyIndex = 0;
      
      function tryNextStrategy() {
        if (strategyIndex >= searchStrategies.length) {
          // If all strategies failed, try a broader search to see what's actually there
          diagnostics.push('All specific searches failed. Trying broader search to see directory structure...');
          
          // Try both People and people for the broad search
          const broadSearchBases = ['ou=People,o=uoguelph.ca', 'ou=people,o=uoguelph.ca', process.env.LDAP_BASE_DN!];
          let broadSearchIndex = 0;
          
          function tryBroadSearch() {
            if (broadSearchIndex >= broadSearchBases.length) {
              diagnostics.push('All broad searches failed');
              client.unbind();
              resolve(NextResponse.json({ 
                error: 'No entry found with any search strategy', 
                diagnostics
              }, { status: 404 }));
              return;
            }
            
            const currentBase = broadSearchBases[broadSearchIndex];
            diagnostics.push(`Trying broad search on base: ${currentBase}`);
            
            const broadOpts = {
              filter: '(objectClass=person)',
              scope: 'one' as const,
              attributes: ['uid', 'cn', 'displayname', 'objectClass', 'mail', 'edupersonprincipalname'],
              sizeLimit: 3
            };
            
            client.search(currentBase, broadOpts, (err: any, res: any) => {
              if (err) {
                diagnostics.push(`✗ Broad search failed on ${currentBase}: ${err.message}`);
                broadSearchIndex++;
                tryBroadSearch();
                return;
              }
              
              const sampleEntries: any[] = [];
              
              res.on('searchEntry', (entry: any) => {
                if (entry?.attributes) {
                  const result: Record<string, any> = {};
                  entry.attributes.forEach((attr: any) => {
                    result[attr.type] = attr.vals || [];
                  });
                  sampleEntries.push(result);
                }
              });
              
              res.on('end', () => {
                diagnostics.push(`Found ${sampleEntries.length} sample entries in ${currentBase}`);
                if (sampleEntries.length > 0) {
                  diagnostics.push('Sample entry structure:');
                  const sample = sampleEntries[0];
                  Object.keys(sample).forEach(key => {
                    diagnostics.push(`  ${key}: ${Array.isArray(sample[key]) ? sample[key].join(', ') : sample[key]}`);
                  });
                  
                  client.unbind();
                  resolve(NextResponse.json({ 
                    error: 'No entry found with any search strategy', 
                    diagnostics,
                    sampleEntries: sampleEntries.slice(0, 3),
                    workingBaseDN: currentBase
                  }, { status: 404 }));
                  return;
                } else {
                  broadSearchIndex++;
                  tryBroadSearch();
                }
              });
              
              res.on('error', (err: any) => {
                diagnostics.push(`✗ Broad search error on ${currentBase}: ${err.message}`);
                broadSearchIndex++;
                tryBroadSearch();
              });
            });
          }
          
          tryBroadSearch();
          return;
        }

        const strategy = searchStrategies[strategyIndex];
        const opts = {
          filter: strategy.filter,
          scope: 'sub' as const,
          attributes: [
            'mail', 'telephonenumber', 'roomnumber', 'ou', 
            'uid', 'cn', 'displayname', 'edupersonprincipalname',
            'uogschool', 'departmentnumber', 'givenname', 'sn',
            'uoglegalfirstname', 'uoglegallastname', 'uognickname'
          ],
        };

        diagnostics.push(`Trying strategy ${strategyIndex + 1}: ${strategy.description}`);
        diagnostics.push(`Search filter: ${strategy.filter}`);
        diagnostics.push(`Search base DN: ${strategy.baseDN}`);

        client.search(strategy.baseDN, opts, (err: any, res: any) => {
          if (err) {
            diagnostics.push(`✗ Strategy ${strategyIndex + 1} search error: ${err.message}`);
            strategyIndex++;
            tryNextStrategy();
            return;
          }
          
          const entries: any[] = [];

          res.on('searchEntry', (entry: any) => {
            diagnostics.push(`✓ Strategy ${strategyIndex + 1} found entry!`);

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

          res.on('error', (err: any) => {
            diagnostics.push(`✗ Strategy ${strategyIndex + 1} search error: ${err.message}`);
            strategyIndex++;
            tryNextStrategy();
          });

          res.on('end', (result: any) => {
            diagnostics.push(`Strategy ${strategyIndex + 1} completed with ${entries.length} entries`);
            
            if (entries.length > 0) {
              const entry = entries[0];
              const mail = entry.mail || null;
              const telephoneNumber = entry.telephonenumber || null;
              const roomNumber = entry.roomnumber || null;
              const ou = entry.ou || null;

              diagnostics.push(`✓ Successfully found data using: ${strategy.description}`);
              client.unbind();

              resolve(NextResponse.json({ 
                mail, 
                telephoneNumber, 
                roomNumber, 
                ou, 
                diagnostics,
                foundWith: strategy.description
              }));
              return;
            }
            
            // Try next strategy
            strategyIndex++;
            tryNextStrategy();
          });
        });
      }

      // Start with the first strategy
      tryNextStrategy();
    });
  });
}
