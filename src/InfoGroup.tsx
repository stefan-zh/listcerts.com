import React from 'react';
import './InfoGroup.css';
import {Certificate, CryptoInfo, Name, PublicKey} from "./data";

export const InfoGroup = ({cert, certChain}: {cert: Certificate, certChain: string}) => (
  <>
    {toNameGroup(cert.subject, "Subject")}
    {toNameGroup(cert.issuer, "Issuer")}
    {toValidity(cert)}
    {cert.sans && toSANs(cert.sans)}
    {toPubKeyInfo(cert.pub_key_info)}
    {toCryptoInfo(cert.crypto_info, certChain)}
    {toFingerprints(cert)}
    {toBasicConstraints(cert.ca)}
    {toKeyUsages(cert.key_usage, "Key")}
    {cert.extended_key_usages && toKeyUsages(cert.extended_key_usages, "Extended Key")}
    {toSubKeyId(cert.subject_key_id)}
    {cert.authority_key_id && toAuthKeyId(cert.authority_key_id)}
    {cert.crl_endpoints && toCrlEndpoints(cert.crl_endpoints)}
    {cert.ocsp_server && toOcspServer(cert.ocsp_server)}
    {cert.issuing_cert_url && toCaIssuers(cert.issuing_cert_url)}
  </>
);

// Produces the JSX group information for a Name property
const toNameGroup = (nameGroup: Name, nameStr: string) => (
  <div className={"info-group " + nameStr}>
    <span className="info-group-title">{nameStr} Name</span>
    <div />
    {nameGroup.country &&
    <div className="info-item">
      <label>Country</label>
      <span>{nameGroup.country}</span>
    </div>
    }
    {nameGroup.state_province &&
    <div className="info-item">
      <label>State/Province</label>
      <span>{nameGroup.state_province}</span>
    </div>
    }
    {nameGroup.locality &&
    <div className="info-item">
      <label>Locality</label>
      <span>{nameGroup.locality}</span>
    </div>
    }
    {nameGroup.organization &&
    <div className="info-item">
      <label>Organization</label>
      <span>{nameGroup.organization}</span>
    </div>
    }
    {nameGroup.organizational_unit &&
    <div className="info-item">
      <label>Organizational Unit</label>
      <span>{nameGroup.organizational_unit}</span>
    </div>
    }
    {nameGroup.common_name &&
    <div className="info-item">
      <label>Common Name</label>
      <span>{nameGroup.common_name}</span>
    </div>
    }
  </div>
);

// Produces the validity information
const toValidity = (cert: Certificate) => (
  <div className="info-group validity">
    <span className="info-group-title">Validity</span>
    <div />
    {cert.not_before &&
    <div className="info-item">
      <label>Not Before</label>
      <span>{new Date(cert.not_before).toUTCString()}</span>
    </div>
    }
    {cert.not_after &&
    <div className="info-item">
      <label>Not After</label>
      <span>{new Date(cert.not_after).toUTCString()}</span>
    </div>
    }
  </div>
);

// Produces the Subject Alt Names information
const toSANs = (sans: string[]) => (
  <div className="info-group sans">
    <span className="info-group-title">Subject Alt Names</span>
    <div />
    {sans.map((subAltName) => (
      <div key={subAltName} className="info-item">
        <label>DNS Name</label>
        <span>{subAltName}</span>
      </div>
    ))}
  </div>
);

// Produces the Public Key information
const toPubKeyInfo = (pubKey: PublicKey) => (
  <div className="info-group pub-key">
    <span className="info-group-title">Public Key Info</span>
    <div />
    {pubKey.algorithm &&
    <div className="info-item">
      <label>Algorithm</label>
      <span>{pubKey.algorithm}</span>
    </div>
    }
    {pubKey.size &&
    <div className="info-item">
      <label>Size</label>
      <span>{pubKey.size}</span>
    </div>
    }
    {pubKey.value &&
    <div className="info-item">
      <label>Value</label>
      <span>{pubKey.value}</span>
    </div>
    }
  </div>
);

// Produces the Crypto Information
const toCryptoInfo = (cryptoInfo: CryptoInfo, certChain: string) => {
  const certPEM = new Blob([cryptoInfo.pem]);
  const certUrl = URL.createObjectURL(certPEM);
  const certChainPEM = new Blob([certChain]);
  const certChainUrl = URL.createObjectURL(certChainPEM)
  return (
    <div className="info-group crypto-info">
      <span className="info-group-title">Crypto Info</span>
      <div />
      <div className="info-item">
        <label>Serial Number</label>
        <span>{cryptoInfo.serial_number}</span>
      </div>
      <div className="info-item">
        <label>Signature Algorithm</label>
        <span>{cryptoInfo.signature_algorithm}</span>
      </div>
      <div className="info-item">
        <label>Version</label>
        <span>{cryptoInfo.version}</span>
      </div>
      <div className="info-item">
        <label>Download</label>
        <div>
          <a href={certUrl} download="crt.pem">PEM (cert)</a>
          <a href={certChainUrl} download="chain.pem">PEM (chain)</a>
        </div>
      </div>
    </div>
  );
}

// Produces the Fingerprints information
const toFingerprints = (cert: Certificate) => (
  <div className="info-group fingerprints">
    <span className="info-group-title">Fingerprints</span>
    <div />
    <div className="info-item">
      <label>SHA-256</label>
      <span>{cert.sha256}</span>
    </div>
    <div className="info-item">
      <label>SHA-1</label>
      <span>{cert.sha1}</span>
    </div>
  </div>
);

// Produces the Basic Constraints information
const toBasicConstraints = (isCa: boolean) => (
  <div className="info-group basic-constraints">
    <span className="info-group-title">Basic Constraints</span>
    <div />
    <div className="info-item">
      <label>Certificate Authority</label>
      <span>{isCa ? "Yes" : "No"}</span>
    </div>
  </div>
);

// Produces the Key Usages information
const toKeyUsages = (keyUsages: string[], kind: string) => (
  <div className={"info-group " + {kind} + "-usages"}>
    <span className="info-group-title">{kind} Usages</span>
    <div />
    <div className="info-item">
      <label>Purposes</label>
      <span>{keyUsages.join(", ")}</span>
    </div>
  </div>
);

// Produces the Subject Key ID
const toSubKeyId = (subKeyId: string) => (
  <div className="info-group sub-key-id">
    <span className="info-group-title">Subject Key ID</span>
    <div />
    <div className="info-item">
      <label>Key ID</label>
      <span>{subKeyId}</span>
    </div>
  </div>
);

// Produces the Authority Key ID
const toAuthKeyId = (authKeyId: string) => (
  <div className="info-group auth-key-id">
    <span className="info-group-title">Authority Key ID</span>
    <div />
    <div className="info-item">
      <label>Key ID</label>
      <span>{authKeyId}</span>
    </div>
  </div>
);

// Produces the CRL Endpoints information
const toCrlEndpoints = (endpoints: string[]) => (
  <div className="info-group crl-endpoints">
    <span className="info-group-title">CRL Endpoints</span>
    <div />
    {endpoints.map((ep) => (
      <div key={ep} className="info-item">
        <label>Distribution Point</label>
        <a href={ep} target="_blank" rel="noreferrer">{ep}</a>
      </div>
    ))}
  </div>
);

// Produces the OCSP Servers information
const toOcspServer = (servers: string[]) => (
  <div className="info-group ocsp">
    <span className="info-group-title">OCSP Server</span>
    <div />
    {servers.map((server) => (
      <div key={server} className="info-item">
        <label>Location</label>
        <a href={server} target="_blank" rel="noreferrer">{server}</a>
      </div>
    ))}
  </div>
);

// Produces the CA Issuers information
const toCaIssuers = (caIssuers: string[]) => (
  <div className="info-group ca-issuers">
    <span className="info-group-title">CA Issuers</span>
    <div />
    {caIssuers.map((iss) => (
      <div key={iss} className="info-item">
        <label>Location</label>
        <a href={iss} target="_blank" rel="noreferrer">{iss}</a>
      </div>
    ))}
  </div>
);