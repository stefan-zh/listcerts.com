import React from 'react';
import './InfoGroup.css';

export const InfoGroup = () => (
  <>
    <div className="info-group">
      <span className="info-group-title">Subject Name</span>
      <div />
      <div className="info-item">
        <label>Country</label>
        <span>US</span>
      </div>
      <div className="info-item">
        <label>State/Province</label>
        <span>California</span>
      </div>
      <div className="info-item">
        <label>Locality</label>
        <span>San Francisco</span>
      </div>
      <div className="info-item">
        <label>Organization</label>
        <span>Cloudflare, Inc</span>
      </div>
      <div className="info-item">
        <label>Common Name</label>
        <span>sni.cloudflaressl.com</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Issuer Name</span>
      <div />
      <div className="info-item">
        <label>Country</label>
        <span>US</span>
      </div>
      <div className="info-item">
        <label>Organization</label>
        <span>Cloudflare, Inc.</span>
      </div>
      <div className="info-item">
        <label>Common Name</label>
        <span>Cloudflare Inc ECC CA-3</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Validity</span>
      <div />
      <div className="info-item">
        <label>Not Before</label>
        <span>Wed, 16 Jun 2021 00:00:00 GMT</span>
      </div>
      <div className="info-item">
        <label>Not After</label>
        <span>Wed, 15 Jun 2022 23:59:59 GMT</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Subject Alt Names</span>
      <div />
      <div className="info-item">
        <label>DNS Name</label>
        <span>*.census2021.bg</span>
      </div>
      <div className="info-item">
        <label>DNS Name</label>
        <span>sni.cloudflaressl.com</span>
      </div>
      <div className="info-item">
        <label>DNS Name</label>
        <span>census2021.bg</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Public Key Info</span>
      <div />
      <div className="info-item">
        <label>Algorithm</label>
        <span>Elliptic Curve</span>
      </div>
      <div className="info-item">
        <label>Size</label>
        <span>256</span>
      </div>
      <div className="info-item">
        <label>Value</label>
        <span>04:5F:4D:C0:F0:F7:13:3B:12:24:F1:FB:0C:D2:20:60:D3:9A:B0:05:F5:46:FD:55:D5:70:F6:17:A6:E8:B7:46:25:AB:BF:8B:FD:E8:E5:8C:87:B7:53:C2:17:29:4A:5F:6C:F8:D7:3E:7B:AE:E8:A8:AB:EB:FB:30:A7:DD:05:58:F5</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Miscellaneous</span>
      <div />
      <div className="info-item">
        <label>Serial Number</label>
        <span>06:9C:A3:93:2E:6D:72:80:A3:49:66:62:EA:BE:69:3C</span>
      </div>
      <div className="info-item">
        <label>Signature Algorithm</label>
        <span>ECDSA with SHA-256</span>
      </div>
      <div className="info-item">
        <label>Version</label>
        <span>3</span>
      </div>
      <div className="info-item">
        <label>Download</label>
        <span>PEM</span>
      </div>
    </div>
    <div className="info-group">
      <span className="info-group-title">Fingerprints</span>
      <div />
      <div className="info-item">
        <label>SHA-256</label>
        <span>BF:29:67:74:7D:73:1B:81:52:FF:DE:AC:3B:F5:C5:5B:2B:FF:C7:E7:63:79:0C:2E:DE:D1:C6:2A:ED:F9:2F:58</span>
      </div>
      <div className="info-item">
        <label>SHA-1</label>
        <span>59:97:00:91:24:9D:11:B4:2F:78:35:61:21:9F:C1:BB:B9:30:66:D9</span>
      </div>
    </div>
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