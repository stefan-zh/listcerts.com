import React from 'react';
import './InfoGroup.css';
import {Certificate, Miscellaneous, Name, PublicKey} from "./data";

export const InfoGroup = ({cert}: {cert: Certificate}) => (
  <>
    {toNameGroup(cert.subject, "Subject")}
    {toNameGroup(cert.issuer, "Issuer")}
    {toValidity(cert)}
    {cert.sans && toSANs(cert.sans)}
    {toPubKeyInfo(cert.pub_key_info)}
    {toMiscellaneous(cert.misc)}
    {toFingerprints(cert)}
    <div className="info-group">
      <span className="info-group-title">Basic Constraints</span>
      <div />
      <div className="info-item">
        <label>Certificate Authority</label>
        <span>No</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Key Usages</span>
      <div />
      <div className="info-item">
        <label>Purposes</label>
        <span>Digital Signature</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Extended Key Usages</span>
      <div />
      <div className="info-item">
        <label>Purposes</label>
        <span>Server Authentication, Client Authentication</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Subject Key ID</span>
      <div />
      <div className="info-item">
        <label>Key ID</label>
        <span>F6:7D:09:40:C1:A7:65:6A:EC:C2:2A:D2:50:9A:5E:20:54:FA:4C:0C</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Authority Key ID</span>
      <div />
      <div className="info-item">
        <label>Key ID</label>
        <span>A5:CE:37:EA:EB:B0:75:0E:94:67:88:B4:45:FA:D9:24:10:87:96:1F</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">CRL Endpoints</span>
      <div />
      <div className="info-item">
        <label>Distribution Point</label>
        <span>http://crl3.digicert.com/CloudflareIncECCCA-3.crl</span>
      </div>
      <div className="info-item">
        <label>Distribution Point</label>
        <span>http://crl4.digicert.com/CloudflareIncECCCA-3.crl</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">OCSP Server</span>
      <div />
      <div className="info-item">
        <label>Location</label>
        <span>http://ocsp.digicert.com</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">CA Issuers</span>
      <div />
      <div className="info-item">
        <label>Location</label>
        <span>http://cacerts.digicert.com/CloudflareIncECCCA-3.crt</span>
      </div>
    </div>
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
      <div className="info-item">
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

// Produces the Miscellaneous information
const toMiscellaneous = (misc: Miscellaneous) => {
  const blob = new Blob([misc.pem]);
  const url = URL.createObjectURL(blob);
  return (
    <div className="info-group miscellaneous">
      <span className="info-group-title">Miscellaneous</span>
      <div />
      <div className="info-item">
        <label>Serial Number</label>
        <span>{misc.serial_number}</span>
      </div>
      <div className="info-item">
        <label>Signature Algorithm</label>
        <span>{misc.signature_algorithm}</span>
      </div>
      <div className="info-item">
        <label>Version</label>
        <span>{misc.version}</span>
      </div>
      <div className="info-item">
        <label>Download</label>
        <a href={url} download="crt.pem">PEM</a>
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