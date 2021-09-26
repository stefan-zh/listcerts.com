import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Alert, Button, Container, Form, InputGroup, Nav, Navbar} from "react-bootstrap";
import './App.css';

interface Certificate {
  subject: Name;
  issuer: Name;
  not_before: Date;
  not_after: Date;
  sans: string[];
  pub_key_info: PublicKey;
  misc: Miscellaneous;
  sha256: string;
  sha1: string;
  ca: boolean;
  key_usage: string;
  extended_key_usages: string[];
  subject_key_id: string;
  authority_key_id: string;
  crl_endpoints: string[];
  ocsp_server: string[];
  issuing_cert_url: string[];
}

interface Name {
  country: string;
  state_province: string;
  locality: string;
  organization: string;
  organizational_unit: string;
  common_name: string;
}

interface PublicKey {
  algorithm: string;
  size: number;
  value: string;
}

interface Miscellaneous {
  serial_number: string;
  signature_algorithm: string;
  version: number;
  pem: string;
}

function App() {
  const [url, setUrl] = useState<string>("");
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [err, setErr] = useState<string>("");

  // Fetches the certificates for the URL from the API
  const fetchCerts = async (url: string) => {
    const response = await window.fetch('https://s2e4by92j1.execute-api.eu-central-1.amazonaws.com/prod/certs', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({domain: url}),
    })
    if (!response.ok) {
      setCerts([]);
      setErr(await response.text());
    } else {
      const certsJson: {certs: Certificate[]} = await response.json();
      setCerts(certsJson.certs);
      setErr("");
    }
  }

  const onInput = (input: ChangeEvent<HTMLInputElement>) => {
    setUrl(input.target.value);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCerts(url);
  }

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand>listcerts.com</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Form onSubmit={onSubmit}>
          <InputGroup className="search">
            <Form.Control size="lg" type="text" onChange={onInput}  placeholder="https://www.example.com" />
            <InputGroup.Text>
              <Button id="submit" variant="light" type="submit">Search</Button>
            </InputGroup.Text>
          </InputGroup>
        </Form>
        {err &&
          <Alert variant="danger">{err}</Alert>
        }
        {certs &&
          <Nav justify variant="tabs" defaultActiveKey="cert-0">
            {certs.map((cert, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link eventKey={'cert-' + idx}>{cert.subject.common_name}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        }
      </Container>
    </>
  );
}

export default App;
