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
    diagnostics.push(`Environment check: LDAP_PASSWORD=${process.env.LDAP_PASSWORD ? 'SET' : 'NOT SET'}`);
    
    // Add length checks to verify variables have actual content
    if (process.env.LDAP_URL) {
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
    }
    
    // Check if any critical env vars are missing or empty
    if (!process.env.LDAP_URL || !process.env.LDAP_BIND_DN || !process.env.LDAP_PASSWORD || !process.env.LDAP_BASE_DN) {
      diagnostics.push('✗ Critical LDAP environment variables are missing!');
      resolve(NextResponse.json({ 
        error: 'Missing LDAP environment variables', 
        diagnostics 
      }, { status: 500 }));
      return;
    }
    
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

      // Test bind permissions with a simple search to verify the bind actually works
      diagnostics.push('Testing bind permissions with root search...');
      const testOpts = {
        filter: '(objectClass=organization)',
        scope: 'base' as const,
        attributes: ['o'],
        sizeLimit: 1
      };

      client.search('o=uoguelph.ca', testOpts, (testErr: any, testRes: any) => {
        if (testErr) {
          diagnostics.push(`✗ Bind permission test failed: ${testErr.message}`);
          diagnostics.push('This suggests the LDAP credentials may be incorrect or have insufficient permissions');
          if (testErr.code) {
            diagnostics.push(`Permission test error code: ${testErr.code}`);
          }
          
          client.unbind();
          resolve(NextResponse.json({ 
            error: 'LDAP bind succeeded but permissions test failed - check credentials', 
            diagnostics 
          }, { status: 500 }));
          return;
        }

        let permissionTestPassed = false;

        testRes.on('searchEntry', (entry: any) => {
          diagnostics.push('✓ Bind permission test passed - credentials are working');
          permissionTestPassed = true;
        });

        testRes.on('error', (testResErr: any) => {
          diagnostics.push(`✗ Bind permission test error: ${testResErr.message}`);
          client.unbind();
          resolve(NextResponse.json({ 
            error: 'LDAP permissions insufficient', 
            diagnostics 
          }, { status: 500 }));
        });

        testRes.on('end', () => {
          if (!permissionTestPassed) {
            diagnostics.push('✗ Bind permission test failed - no results returned');
            diagnostics.push('This indicates insufficient LDAP permissions or incorrect credentials');
            client.unbind();
            resolve(NextResponse.json({ 
              error: 'LDAP permissions insufficient or credentials incorrect', 
              diagnostics 
            }, { status: 500 }));
            return;
          }

          // Permissions verified, proceed with user search
          proceedWithUserSearch();
        });
      });

      function proceedWithUserSearch() {

      function proceedWithUserSearch() {
        // Simple focused search - just try the most likely scenarios
        const searchStrategies = [
          { filter: `(uid=${uid})`, description: 'Standard uid search', baseDN: 'ou=People,o=uoguelph.ca' },
          { filter: `(uid=${uid})`, description: 'Standard uid search (env variable)', baseDN: process.env.LDAP_BASE_DN! },
          { filter: `(mail=${uid}@uoguelph.ca)`, description: 'Email exact search', baseDN: 'ou=People,o=uoguelph.ca' }
        ];

        let strategyIndex = 0;
        
        function tryNextStrategy() {
          if (strategyIndex >= searchStrategies.length) {
            diagnostics.push('All searches failed. This could indicate:');
            diagnostics.push('1. The user does not exist in the LDAP directory');
            diagnostics.push('2. Insufficient search permissions for the bind user');
            diagnostics.push('3. Network connectivity issues between Netlify and LDAP server');
            diagnostics.push('4. Different LDAP server configuration between local and production');
            
            client.unbind();
            resolve(NextResponse.json({ 
              error: 'No entry found with any search strategy', 
              diagnostics,
              troubleshooting: {
                bindSuccessful: true,
                connectionSuccessful: true,
                permissionTestPassed: true,
                searchesAttempted: searchStrategies.length,
                recommendedAction: 'Verify user exists in LDAP directory'
              }
            }, { status: 404 }));
            return;
          }

          const strategy = searchStrategies[strategyIndex];
          const opts = {
            filter: strategy.filter,
            scope: 'sub' as const,
            attributes: [
              'mail', 'telephonenumber', 'roomnumber', 'ou', 
              'uid', 'cn', 'displayname', 'givenname', 'sn'
            ],
            sizeLimit: 1  // Only need one result
          };

          diagnostics.push(`Trying strategy ${strategyIndex + 1}: ${strategy.description}`);
          diagnostics.push(`Search filter: ${strategy.filter}`);
          diagnostics.push(`Search base DN: ${strategy.baseDN}`);

          client.search(strategy.baseDN, opts, (err: any, res: any) => {
            if (err) {
              diagnostics.push(`✗ Strategy ${strategyIndex + 1} search error: ${err.message}`);
              if (err.code) {
                diagnostics.push(`Error code: ${err.code}`);
              }
              strategyIndex++;
              tryNextStrategy();
              return;
            }
            
            const entries: any[] = [];
            let searchCompleted = false;

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
                diagnostics.push(`Entry attributes found: ${Object.keys(result).join(', ')}`);
              }
            });

            res.on('error', (err: any) => {
              if (!searchCompleted) {
                diagnostics.push(`✗ Strategy ${strategyIndex + 1} search error: ${err.message}`);
                if (err.code) {
                  diagnostics.push(`Error code: ${err.code}`);
                }
                strategyIndex++;
                tryNextStrategy();
              }
            });

            res.on('end', (result: any) => {
              searchCompleted = true;
              diagnostics.push(`Strategy ${strategyIndex + 1} completed with ${entries.length} entries`);
              diagnostics.push(`Search result status: ${result?.status || 'unknown'}`);
              
              if (entries.length > 0) {
                const entry = entries[0];
                const mail = entry.mail || null;
                const telephoneNumber = entry.telephonenumber || null;
                const roomNumber = entry.roomnumber || null;
                const ou = entry.ou || null;

                diagnostics.push(`✓ Successfully found data using: ${strategy.description}`);
                diagnostics.push(`Retrieved data: mail=${mail}, phone=${telephoneNumber}, room=${roomNumber}, ou=${ou}`);
                client.unbind();

                resolve(NextResponse.json({ 
                  mail, 
                  telephoneNumber, 
                  roomNumber, 
                  ou, 
                  diagnostics,
                  foundWith: strategy.description,
                  fullEntry: entry  // Include full entry for debugging
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
      }
    });
  });
}
