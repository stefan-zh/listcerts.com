import {ChangeEvent, FormEvent, useState} from 'react';
import {Alert, Button, Container, Form, InputGroup, Nav, Navbar, Spinner, Tab} from "react-bootstrap";
import {CertResponse} from './data';
import './App.css';
import {InfoGroup} from "./InfoGroup";

export const App = () => {
  const [url, setUrl] = useState<string>("");
  const [data, setData] = useState<CertResponse>({certs:[], cert_chain: ""});
  const [activeTab, setActiveTab] = useState<string>("cert-0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");

  /**
   * Fetches the certificates for the URL from the API.
   * 
   * NOTE: This has to be done in a backend API since it is not possible to retrieve 
   * certificate information in the browser: https://stackoverflow.com/q/2604399/9698467
   * Also, the 'node:https' module is not available in the browser/client.
   */
  const fetchCerts = async (url: string) => {
    setIsLoading(true);
    const response = await window.fetch('https://s2e4by92j1.execute-api.eu-central-1.amazonaws.com/prod/certs', {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({domain: url}),
    })
    if (!response.ok) {
      setData({certs:[], cert_chain: ""});
      const err = await response.text();
      setErr(err.length === 0 ? response.statusText : err);
    } else {
      const data: CertResponse = await response.json();
      setActiveTab("cert-0");
      setData(data);
      setErr("");
    }
    setIsLoading(false);
  }

  const onInput = (input: ChangeEvent<HTMLInputElement>) => {
    setUrl(input.target.value);
  }

  // controls the active tab
  const onTabSelect = (tab: string | null) => setActiveTab(tab || "cert-0");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCerts(url);
  }

  const reset = () => {
    setUrl("");
    setData({certs:[], cert_chain: ""});
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
            <Form.Control size="lg" type="text" autoFocus onChange={onInput} placeholder="https://www.example.com" value={url}/>
            <InputGroup.Text>
              <Button id="submit" variant="light" type="submit">
                {isLoading && <Spinner as="span" animation="border" size="sm" variant="secondary" className="spinner"/>}
                Search
              </Button>
            </InputGroup.Text>
          </InputGroup>
        </Form>
        {err &&
        <Alert variant="danger">{err}</Alert>
        }
        {data.certs.length > 0 && data.cert_chain.length > 0 &&
        <Tab.Container activeKey={activeTab} onSelect={onTabSelect}>
          <Nav justify variant="tabs">
            {data.certs.map((cert, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link eventKey={'cert-' + idx}>
                  {cert.subject.common_name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {data.certs.map((cert, idx) => (
              <Tab.Pane key={idx} eventKey={'cert-' + idx}>
                <InfoGroup cert={cert} certChain={data.cert_chain} />
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
        }
      </Container>
      <div className="footer">
        <Container>
          <span>© {new Date().getFullYear()} Created by <a href="https://stefanzh.com" target="_blank" rel="noreferrer">Stefan Zhelyazkov</a>.
          Inspired by the <a href="https://www.mozilla.org/en-US/firefox/" target="_blank" rel="noreferrer">Firefox</a> browser.</span>
        </Container>
      </div>
    </div>
  );
};
