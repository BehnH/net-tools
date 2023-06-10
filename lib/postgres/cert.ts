import { getCache } from "../redis/redis";
import sql from "./db"

const lookupCerts = async (domain: string, includeSql: boolean) => {
  console.log('looking up certs for', domain);
  const cache = await getCache();

  try {
    const certs = await sql`
    WITH ci AS (
    SELECT min(sub.CERTIFICATE_ID) ID,
           min(sub.ISSUER_CA_ID) ISSUER_CA_ID,
           array_agg(DISTINCT sub.NAME_VALUE) NAME_VALUES,
           x509_commonName(sub.CERTIFICATE) COMMON_NAME,
           x509_notBefore(sub.CERTIFICATE) NOT_BEFORE,
           x509_notAfter(sub.CERTIFICATE) NOT_AFTER,
           encode(x509_serialNumber(sub.CERTIFICATE), 'hex') SERIAL_NUMBER
        FROM (SELECT *
            FROM certificate_and_identities cai
            WHERE plainto_tsquery('certwatch', ${domain}) @@ identities(cai.CERTIFICATE)
                AND cai.NAME_VALUE ILIKE (${'%' + domain + '%'})
            LIMIT 10000
        ) sub
        GROUP BY sub.CERTIFICATE
    )
    SELECT ci.ISSUER_CA_ID,
        ca.NAME ISSUER_NAME,
        ci.COMMON_NAME,
        array_to_string(ci.NAME_VALUES, chr(10)) NAME_VALUE,
        ci.ID ID,
        le.ENTRY_TIMESTAMP,
        ci.NOT_BEFORE,
        ci.NOT_AFTER,
        ci.SERIAL_NUMBER
    FROM ci
        LEFT JOIN LATERAL (
            SELECT min(ctle.ENTRY_TIMESTAMP) ENTRY_TIMESTAMP
                FROM ct_log_entry ctle
                WHERE ctle.CERTIFICATE_ID = ci.ID
        ) le ON TRUE,
         ca
    WHERE ci.ISSUER_CA_ID = ca.ID
    ORDER BY le.ENTRY_TIMESTAMP DESC NULLS LAST;
    `

    cache.setEx(`all-${domain}`, 60 * 60 * 6, JSON.stringify(certs));

    return certs;
  } catch (e: any) {
    console.log(e)
    console.log('error looking up certs for', domain)
    return {
      error: e.message,
    }
  }
}

const lookupCertsWithoutExpired = async (domain: string, includeSql: boolean) => {
  console.log('looking up non-expired certs for', domain);
  const cache = await getCache();

  try {
    const certs = await sql`
    WITH ci AS (
        SELECT min(sub.CERTIFICATE_ID) ID,
               min(sub.ISSUER_CA_ID) ISSUER_CA_ID,
               array_agg(DISTINCT sub.NAME_VALUE) NAME_VALUES,
               x509_commonName(sub.CERTIFICATE) COMMON_NAME,
               x509_notBefore(sub.CERTIFICATE) NOT_BEFORE,
               x509_notAfter(sub.CERTIFICATE) NOT_AFTER,
               encode(x509_serialNumber(sub.CERTIFICATE), 'hex') SERIAL_NUMBER
            FROM (SELECT *
                      FROM certificate_and_identities cai
                      WHERE plainto_tsquery('certwatch', ${domain}) @@ identities(cai.CERTIFICATE)
                          AND cai.NAME_VALUE ILIKE (${'%' + domain + '%'})
                          AND coalesce(x509_notAfter(cai.CERTIFICATE), 'infinity'::timestamp) >= date_trunc('year', now() AT TIME ZONE 'UTC')
                          AND x509_notAfter(cai.CERTIFICATE) >= now() AT TIME ZONE 'UTC'
                      LIMIT 10000
                 ) sub
            GROUP BY sub.CERTIFICATE
    )
    SELECT ci.ISSUER_CA_ID,
            ca.NAME ISSUER_NAME,
            ci.COMMON_NAME,
            array_to_string(ci.NAME_VALUES, chr(10)) NAME_VALUE,
            ci.ID ID,
            le.ENTRY_TIMESTAMP,
            ci.NOT_BEFORE,
            ci.NOT_AFTER,
            ci.SERIAL_NUMBER
        FROM ci
                LEFT JOIN LATERAL (
                    SELECT min(ctle.ENTRY_TIMESTAMP) ENTRY_TIMESTAMP
                        FROM ct_log_entry ctle
                        WHERE ctle.CERTIFICATE_ID = ci.ID
                ) le ON TRUE,
             ca
        WHERE ci.ISSUER_CA_ID = ca.ID
        ORDER BY le.ENTRY_TIMESTAMP DESC NULLS LAST;`

    cache.setEx(`all-${domain}`, 60 * 60 * 6, JSON.stringify(certs));

    return certs
  } catch (e: any) {
    console.log(e.message)
    console.log('error looking up certs for', domain)
    return {
      error: e.message,
    }
  }

}

export {
  lookupCerts,
  lookupCertsWithoutExpired,
}
