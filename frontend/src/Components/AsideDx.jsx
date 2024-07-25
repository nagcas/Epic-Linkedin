// Importa il file CSS per lo stile del componente
import '../style/Profile.css'; 

import React, { useState, useEffect, useContext } from 'react';
// Importa i CSS di Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ModalUsers from './ModalUsers';
import fetchWithAuth from '../services/fetchWithAuth';
import { AuthContext } from '../Context/AuthContext';

const AsideDx = () => {
  // URL per l'API dei profili
  const url = 'http://localhost:5000/profile';

  const { authorLogin, setAuthorLogin } = useContext(AuthContext);

  // Stati per gestire i profili, lo spinner e gli errori
  const [profiles, setProfiles] = useState([]);
  //const Token = process.env.TOKEN; // Token di autenticazione per l'API
  const [isEnableSpinner, setIsEnableSpinner] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  // Seleziona i primi 20 profili
  const tenprofiles = profiles.slice(0, 20);

  // Effetto per caricare i profili all'avvio del componente
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsEnableSpinner(true);
      try {
        const data = await fetchWithAuth(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProfiles(data.profiles);
        setIsEnableSpinner(false);
        setIsError(false);
      }    
      catch (error) {
        console.error('Errore nella richiesta:', error);
        setIsError(true);
      }
    };

    fetchProfiles();
  }, []);

  //console.log(profiles);

  return (
    <section className="card" tabIndex="-1" data-view-name="profile-card">
      <div className="card-header">
        <h4 className="card-title">Altri profili simili</h4>
      </div>
      {/* Mostra lo spinner durante il caricamento */}
      {isEnableSpinner && <div className='text-center mt-1'><Spinner animation='grow' /></div>}
      {/* Mostra un messaggio di errore se il caricamento fallisce */}
      {isError && <div className='text-center mt-1'><Alert variant='danger'>Error loading...</Alert></div>}
      <div className="list-group list-group-flush p-4">
        {/* Mappa i profili se ce ne sono, altrimenti mostra un messaggio */}
        {tenprofiles.length > 0 ? (
          tenprofiles.filter((prof) => prof.username != authorLogin.username)
          .map((profile) => (
            <Container onClick={() => navigate(`/profile/${profile._id}`)} key={profile._id} className='select__user'>
              <Row className='justify-content-start my-2'>
              <Col sm={12} lg={3}>
              <img
                src={profile.image}
                alt={`Foto del profilo di ${profile.username}`}
                className="rounded-circle me-3"
                width="48"
                height="48"
                loading="lazy"
              />
              </Col>
              <Col sm={12} lg={9} className='d-column'>
                <h5 className="mb-1 text-start">{profile.name} {profile.surname}</h5>
                <p className="mb-1 text-start">{profile.title}</p>
              </Col>
              </Row>
              <div className='divider_line'></div>
            </Container >
          ))
        ) : (
          <p className="list-group-item">Nessun profilo trovato</p>
        )}
      </div>
      <div className="card-footer">
          {/* Componente per mostrare tutti i profili in un modal */}
          <ModalUsers profiles={profiles} />
      </div>
    </section>
  );
}

export default AsideDx;