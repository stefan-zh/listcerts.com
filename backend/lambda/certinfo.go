package main

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/ed25519"
	"crypto/elliptic"
	"crypto/rsa"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"encoding/pem"
	"fmt"
	"strings"
	"time"
)

var (
	// KeyUsageToString maps an x509.KeyUsage bitmask to its name.
	KeyUsageToString = map[x509.KeyUsage]string{
		x509.KeyUsageDigitalSignature:  "Digital Signature",
		x509.KeyUsageContentCommitment: "Content Commitment",
		x509.KeyUsageKeyEncipherment:   "Key Encipherment",
		x509.KeyUsageDataEncipherment:  "Data Encipherment",
		x509.KeyUsageKeyAgreement:      "Key Agreement",
		x509.KeyUsageCertSign:          "Certificate Signing",
		x509.KeyUsageCRLSign:           "CRL Signing",
		x509.KeyUsageEncipherOnly:      "Encipher Only",
		x509.KeyUsageDecipherOnly:      "Decipher Only",
	}

	// ExtendedKeyUsageToString maps a x509.ExtKeyUsage bitmask to its name.
	ExtendedKeyUsageToString = map[x509.ExtKeyUsage]string{
		x509.ExtKeyUsageAny:             "Any",
		x509.ExtKeyUsageServerAuth:      "Server Authentication",
		x509.ExtKeyUsageClientAuth:      "Client Authentication",
		x509.ExtKeyUsageCodeSigning:     "Code Signing",
		x509.ExtKeyUsageEmailProtection: "Email Protection",
		x509.ExtKeyUsageIPSECEndSystem:  "IPSEC End System Certificate",
		x509.ExtKeyUsageIPSECTunnel:     "IPSEC Tunnel Certificate",
		x509.ExtKeyUsageIPSECUser:       "IPSEC User Certificate",
		x509.ExtKeyUsageTimeStamping:    "Time Stamping",
		x509.ExtKeyUsageOCSPSigning:     "Sign OCSP Responses",
	}

	// SignatureAlgorithmToString maps a x509.SignatureAlgorithm to its name.
	SignatureAlgorithmToString = map[x509.SignatureAlgorithm]string{
		x509.SHA1WithRSA:      "SHA-1 with RSA Encryption",
		x509.SHA256WithRSA:    "SHA-256 with RSA Encryption",
		x509.SHA384WithRSA:    "SHA-384 with RSA Encryption",
		x509.SHA512WithRSA:    "SHA-512 with RSA Encryption",
		x509.ECDSAWithSHA1:    "ECDSA with SHA-1",
		x509.ECDSAWithSHA256:  "ECDSA with SHA-256",
		x509.ECDSAWithSHA384:  "ECDSA with SHA-384",
		x509.ECDSAWithSHA512:  "ECDSA with SHA-512",
		x509.SHA256WithRSAPSS: "SHA-256 with RSA PSS Encryption",
		x509.SHA384WithRSAPSS: "SHA-384 with RSA PSS Encryption",
		x509.SHA512WithRSAPSS: "SHA-512 with RSA PSS Encryption",
		x509.PureEd25519:      "ED25519",
	}
)

// Certificate represents a JSON description of x509.Certificate
type Certificate struct {
	Subject           Name          `json:"subject,omitempty"`
	Issuer            Name          `json:"issuer,omitempty"`
	NotBefore         time.Time     `json:"not_before"`
	NotAfter          time.Time     `json:"not_after"`
	SANs              []string      `json:"sans,omitempty"`
	PubKeyInfo        PublicKey     `json:"pub_key_info"`
	Misc              Miscellaneous `json:"misc"`
	SHA256            string        `json:"sha256"`
	SHA1              string        `json:"sha1"`
	IsCA              bool          `json:"ca"`
	KeyUsage          string        `json:"key_usage,omitempty"`
	ExtendedKeyUsages []string      `json:"extended_key_usages,omitempty"`
	SKI               string        `json:"subject_key_id"`
	AKI               string        `json:"authority_key_id"`
	CRLEndpoints      []string      `json:"crl_endpoints,omitempty"`
	OCSPServer        []string      `json:"ocsp_server,omitempty"`
	IssuingCertURL    []string      `json:"issuing_cert_url,omitempty"`
}

type Name struct {
	Country            string `json:"country,omitempty"`
	StateProvince      string `json:"state_province,omitempty"`
	Locality           string `json:"locality,omitempty"`
	Organization       string `json:"organization,omitempty"`
	OrganizationalUnit string `json:"organizational_unit,omitempty"`
	CommonName         string `json:"common_name,omitempty"`
}

type PublicKey struct {
	Algorithm string `json:"algorithm"`
	Size      int    `json:"size"`
	Value     string `json:"value"`
}

type Miscellaneous struct {
	SerialNumber       string `json:"serial_number"`
	SignatureAlgorithm string `json:"signature_algorithm"`
	Version            int    `json:"version,omitempty"`
	RawPEM             string `json:"pem"`
}

// ParseCertificate parses an x509.Certificate
func ParseCertificate(cert *x509.Certificate) *Certificate {
	c := &Certificate{
		Subject:           ParseName(cert.Subject),
		Issuer:            ParseName(cert.Issuer),
		NotBefore:         cert.NotBefore,
		NotAfter:          cert.NotAfter,
		SANs:              cert.DNSNames,
		PubKeyInfo:        ParsePubKey(cert),
		Misc:              ParseMiscellaneous(cert),
		SHA256:            sha256hex(cert.Raw),
		SHA1:              sha1hex(cert.Raw),
		IsCA:              cert.IsCA,
		KeyUsage:          KeyUsageToString[cert.KeyUsage],
		ExtendedKeyUsages: extKeyUsagesToString(cert.ExtKeyUsage),
		SKI:               formatID(cert.SubjectKeyId),
		AKI:               formatID(cert.AuthorityKeyId),
		CRLEndpoints:      cert.CRLDistributionPoints,
		OCSPServer:        cert.OCSPServer,
		IssuingCertURL:    cert.IssuingCertificateURL,
	}

	for _, ip := range cert.IPAddresses {
		c.SANs = append(c.SANs, ip.String())
	}
	return c
}

// ParseName parses a new name from a *pkix.Name
func ParseName(name pkix.Name) Name {
	n := Name{
		Country:            strings.Join(name.Country, ","),
		StateProvince:      strings.Join(name.Province, ","),
		Locality:           strings.Join(name.Locality, ","),
		Organization:       strings.Join(name.Organization, ","),
		OrganizationalUnit: strings.Join(name.OrganizationalUnit, ","),
		CommonName:         name.CommonName,
	}
	return n
}

// ParseMiscellaneous parses the miscellaneous properties of the Certificate
func ParseMiscellaneous(cert *x509.Certificate) Miscellaneous {
	n := Miscellaneous{
		SerialNumber:       formatID(cert.SerialNumber.Bytes()),
		SignatureAlgorithm: SignatureAlgorithmToString[cert.SignatureAlgorithm],
		Version:            cert.Version,
		RawPEM:             string(EncodeCertificatePEM(cert)),
	}
	return n
}

// ParsePubKey parses the public key information of the Certificate
func ParsePubKey(cert *x509.Certificate) PublicKey {
	var pubKeyBytes []byte
	var size int
	switch cert.PublicKeyAlgorithm {
	case x509.RSA:
		pubKey := cert.PublicKey.(*rsa.PublicKey)
		pubKeyBytes, _ = asn1.Marshal(*pubKey)
		size = pubKey.N.BitLen()
	case x509.ECDSA:
		pubKey := cert.PublicKey.(*ecdsa.PublicKey)
		pubKeyBytes = elliptic.Marshal(pubKey.Curve, pubKey.X, pubKey.Y)
		size = pubKey.Curve.Params().BitSize
	case x509.Ed25519:
		pubKeyBytes = cert.PublicKey.(ed25519.PublicKey)
		size = ed25519.PublicKeySize
	}
	pubKey := PublicKey{
		Algorithm: cert.PublicKeyAlgorithm.String(),
		Size:      size,
		Value:     formatID(pubKeyBytes),
	}
	return pubKey
}

func formatID(id []byte) string {
	var s string
	for i, c := range id {
		if i > 0 {
			s += ":"
		}
		s += fmt.Sprintf("%02X", c)
	}
	return s
}

func extKeyUsagesToString(keyUsages []x509.ExtKeyUsage) []string {
	var usages []string
	for _, u := range keyUsages {
		usages = append(usages, ExtendedKeyUsageToString[u])
	}
	return usages
}

func sha256hex(certRaw []byte) string {
	sum256 := sha256.Sum256(certRaw)
	return formatID(sum256[:])
}

func sha1hex(certRaw []byte) string {
	sum1 := sha1.Sum(certRaw)
	return formatID(sum1[:])
}

// EncodeCertificatePEM encodes a x509.Certificate to PEM
func EncodeCertificatePEM(cert *x509.Certificate) []byte {
	var buffer bytes.Buffer
	err := pem.Encode(&buffer, &pem.Block{
		Type:  "CERTIFICATE",
		Bytes: cert.Raw,
	})
	if err != nil {
		return nil
	}
	return buffer.Bytes()
}
