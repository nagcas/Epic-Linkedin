import React, { useState, useEffect, useContext } from "react";
import { Form, InputGroup, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Inizializza il navigatore per cambiare pagina
  const location = useLocation(); //  Accedo ai parametri dell'URL corrente

  const API_URL = "http://localhost:5000/";

  const { setIsLoggedIn, setAuthorLogin } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Dettagli errore:", errorData);
        throw new Error(
          `Errore nel login: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();

      const userResponse = await fetch(`${API_URL}auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      const userData = await userResponse.json();
      setAuthorLogin(userData);

      localStorage.setItem("token", data.token);

      window.dispatchEvent(new Event("login"));
      alert("Login effettuato");
      setTimeout(() => {
        navigate("/home");
        console.log("Dati di login inviati:", login);
      }, 1500);
    } catch (error) {
      console.error("Errore nella chiamata API di login:", error);
      alert("Credenziali non valide. Riprova.");
    }
  };

  const handleReset = () => {
    setLogin({
      email: "",
      password: "",
    });
  };

  // Funzione per autenticazione Gooogle
  useEffect(() => {
    // estraggo i parametri dallo URL corrente
    const params = new URLSearchParams(location.search);
    // Cerco parametro 'token' nell'URL corrente
    const token = params.get("token");

    // Se il token esiste, lo imposto nel localStorage
    if (token) {
      // Se troviamo un token, lo salviamo nel localStorage
      localStorage.setItem("token", token);
      // Dispacchamo un evento 'storage' per aggiornare gli altri componenti che potrebbero dipendere dal token
      window.dispatchEvent(new Event("storage"));
      // Navighiamo alla home page
      navigate("/home");
    }
  }, [location, navigate]); // Questo effect dipende da location e navigate

  // Funzione per gestire il login con Google
  const handleGoogleLogin = () => {
    // Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="mt-3">Accedi alla piattaforma</h2>
          <hr />
          <h5>
            Se non sei registrato clicca{" "}
            <Link style={{ cursor: "pointer", color: "blue" }} to="/register">
              qui
            </Link>
          </h5>
          <Form onSubmit={handleLoginSubmit}>
            <InputGroup className="mb-3 mt-5">
              <Form.Control
                placeholder="Email"
                name="email"
                aria-label="Email"
                aria-describedby="basic-addon1"
                type="text"
                value={login.email}
                onChange={handleInputChange}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Control
                className=""
                placeholder="Password"
                name="password"
                aria-label="Password"
                aria-describedby="basic-addon2"
                type="password"
                value={login.password}
                onChange={handleInputChange}
              />
            </InputGroup>

            <Button 
              variant="dark" 
              type="submit" 
              className="add__btn mx-3 mt-3"
            >
              Accedi
            </Button>
            <Button 
              variant="outline-dark" 
              onClick={handleReset} 
              type="button"
              className="btn__altro mx-3 mt-3"
            >
              Resetta
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col className="mt-3">
          <Button
            variant="primary"
            onClick={handleGoogleLogin}
            type="button"
            size="md"
            className="profile__button open__to__btn mx-3 mt-3"
          >
            Login con Google
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
