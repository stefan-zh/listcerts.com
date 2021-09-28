import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Alert, Button, Container, Form, InputGroup, Nav, Navbar, Tab} from "react-bootstrap";
import {Certificate} from './data';
import './App.css';
import {InfoGroup} from "./InfoGroup";

export const App = () => {
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
      const certsJson: { certs: Certificate[] } = await response.json();
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

  const reset = () => {
    setUrl("");
    setCerts([]);
    setErr("");
  }

  return (
    <div className="flex-box">
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="#" onClick={reset}>listcerts.com</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="content">
        <Form onSubmit={onSubmit}>
          <InputGroup className="search">
            <Form.Control size="lg" type="text" onChange={onInput} placeholder="https://www.example.com" value={url}/>
            <InputGroup.Text>
              <Button id="submit" variant="light" type="submit">Search</Button>
            </InputGroup.Text>
          </InputGroup>
        </Form>
        {err &&
        <Alert variant="danger">{err}</Alert>
        }
        {certs.length > 0 &&
        <Tab.Container defaultActiveKey="cert-0">
          <Nav justify variant="tabs" defaultActiveKey="cert-0">
            {certs.map((cert, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link eventKey={'cert-' + idx}>
                  {cert.subject.common_name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {certs.map((cert, idx) => (
              <Tab.Pane key={idx} eventKey={'cert-' + idx}>
                <InfoGroup cert={cert} />
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
        }
      </Container>
      <div className="footer">
        <Container>
          <span>© {new Date().getFullYear()} listcerts.com by <a href="https://stefanzh.com" target="_blank" rel="noreferrer">Stefan Zhelyazkov</a></span>
          <span>The website was created with <a href="https://create-react-app.dev/" target="_blank" rel="noreferrer">create-react-app</a> and
            uses an <a href="https://aws.amazon.com/lambda/" target="_blank" rel="noreferrer">AWS Lambda</a> service
            written in <a href="https://golang.org/" target="_blank" rel="noreferrer">Go</a>. The UI is built
            with <a href="https://react-bootstrap.github.io/" target="_blank" rel="noreferrer">React Bootstrap</a>. The repository
            with the source code is located on <a href="https://github.com/stefan-zh/listcerts.com" target="_blank" rel="noreferrer">GitHub</a>.
          </span>
          <span>Inspired by <a href="https://www.mozilla.org/en-US/firefox/" target="_blank" rel="noreferrer">Firefox</a> from
            the <a href="https://foundation.mozilla.org/" target="_blank" rel="noreferrer">Mozilla Foundation</a>.
          </span>
        </Container>
      </div>
    </div>
  );
};
