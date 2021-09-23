import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Button, Container, Form, InputGroup, Navbar} from "react-bootstrap";
import './App.css';

function App() {
  const [url, setUrl] = useState<string>();
  const onInput = (input: ChangeEvent<HTMLInputElement>) => {
    setUrl(input.target.value);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(url);
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
        <div>{url}</div>
      </Container>
    </>
  );
}

export default App;
