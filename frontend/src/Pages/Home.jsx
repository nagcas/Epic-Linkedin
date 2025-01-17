import React from 'react'; // Importa la libreria React
import { Col, Container, Row } from "react-bootstrap"; // Importa i componenti necessari da react-bootstrap

import Profile from '../Components/Profile'; // Importa il componente Profile
import AsideDx from '../Components/AsideDx'; // Importa il componente AsideDx

// Definisce il componente Home come esportazione predefinita
export default function Home() {
  return (
    // Frammento React utilizzato per raggruppare gli elementi senza aggiungere nodi extra al DOM
    <>
      {/* Contenitore principale da react-bootstrap */}
      <Container>
        {/* Componente Row di react-bootstrap per organizzare il layout */}
        <Row>
          {/* Componente Colonna, 8 su 12 colonne per il componente Profile */}
          <Col md={8}>
            <Profile />
          </Col>
          {/* Componente Colonna, 4 su 12 colonne per il componente AsideDx */}
          <Col md={4}>
            <AsideDx />
          </Col>
        </Row>
      </Container>
    </>
  );
};
