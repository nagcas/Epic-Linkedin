// Importa lo stile CSS personalizzato
import '../style/Profile.css';
// Importa la funzione useParams da react-router-dom per ottenere i parametri dell'URL
import { useParams } from 'react-router-dom';

import React, { useContext, useEffect, useState } from 'react';
// Importa i componenti necessari da react-bootstrap
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
// Importa i componenti per le varie sezioni del profilo utente
import Advised from './infoProfile/Advised';
import Analyses from './infoProfile/Analyses';
import Resources from './infoProfile/Resources';
import Activity from './infoProfile/Activity';
import Experiences from './infoProfile/Experiences';
import Skills from './infoProfile/Skills';
import fetchWithAuth from '../services/fetchWithAuth';
import { AuthContext } from '../Context/AuthContext';
import UpdateProfile from './UpdateProfile';

function UserProfile() {
  // Utilizza useParams per ottenere i parametri dell'URL
  const params = useParams();
  // console.log(params.user); // Debug: stampa i parametri dell'utente

  // URL dell'API per la lettura dei profili
  const url = 'http://localhost:5000/profile/';

  // Recupero il token di autorizzazione
 // const Token = process.env.TOKEN;
  
  // Definizione degli stati locali
  const [profile, setProfile] = useState([]);
  const { authorLogin, setAuthorLogin, isLoggedIn } = useContext(AuthContext);
  const [isEnableSpinner, setIsEnableSpinner] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsEnableSpinner(true);
            const response = await fetchWithAuth(url + params._id, {
      
            });
            
            // console.log(data); // Debug: stampa i dati ricevuti
            setProfile(response);
            setIsError(false);
        } catch (error) {
            console.error('Error loading...', error);
            setIsError(true);
        } finally {
            setIsEnableSpinner(false);
        }
    };

    fetchData();
}, [params._id]);

const handleProfileUpdate = (updatedProfile) => {
  setAuthorLogin((prevState) => ({ ...prevState, ...updatedProfile }));
};


  return ( 
    <>
      {/* Mostra lo spinner di caricamento se isEnableSpinner è true */}
      {isEnableSpinner && <div className='text-center mt-5'><Spinner animation='grow' /></div>}
      {/* Mostra un messaggio di errore se isError è true */}
      {isError && <div className='text-center mt-5'><Alert variant='danger'>Error loading...</Alert></div>}
      
      <Container className='pb-2 border-0 content__card content__profile'>
        {/* Sezione background del profilo */}
        <Row className='profile__bg'>
          <img
            src='https://img.freepik.com/free-photo/gradient-navy-blue-digital-grid-wallpaper_53876-104785.jpg?size=626&ext=jpg&ga=GA1.1.1788614524.1718755200&semt=ais_user'
            alt='Image background profile'
          />
        </Row>
        {/* Sezione immagine del profilo */}
        <Row className='profile__image'>
          <img className='image__user' src={profile.image} alt={profile.name} />
        </Row>
        <div className="d-flex justify-content-end">
          {/* Componente per aggiornare il profilo */}
          {isLoggedIn && profile.username === authorLogin.username && (
            <UpdateProfile
              authorLogin={authorLogin}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
          {/* <button className='upgrade__profile p-0'><i className='fa-solid fa-pen'></i></button> */}
        </div>
        
        {/* Dettagli dell'utente */}
        <Row className='user__detail mt-5'>
          <Col xs={12} md={8}>
            <h4 className='name mb-0 justify-content-start mt-3'>
              {profile.name} {profile.surname}
            </h4>
            <p className='my-0 occupation'>{profile.title}</p>
            <p className='my-0 location text-muted'>{profile.area} • <span className='connections'>Informazioni di contatto</span></p>

            <p className='my-2 connections'>
              5 collegamenti
            </p>
            <div className='d-column justify-content-start'>
              <button 
                className='profile__button open__to__btn mx-3 mt-3'
              >
                <i className="fa-solid fa-user-plus"></i> Collegati
              </button>
              <button
                variant='outline-primary'
                className='add__btn mx-3 mt-3'
              >
                <i className="fa-solid fa-paper-plane"></i> Messaggio
              </button>
              <button 
                variant='outline-secondary' 
                className='btn__altro mx-3 mt-3'
              >
                Altro
              </button>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <ul>
              <li className='education mb-1'>
                <img
                  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9bSdmyPGsBkS5WQ7fjHWoPIcYcHnOUlJ1cQ&s'
                  alt='Logo Epicode'
                  className='mr-2'
                />
                Epicode
              </li>

              <li className='education'>
                <img
                  src='https://cdn.stocksnap.io/img-thumbs/960w/woman-developer_HMPNPRBUJ7.jpg'
                  alt='Logo FullStack Web Developer'
                  className='mr-2'
                />
                FullStack Web Developer
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Sezione "Consigliato per te" */}
      <Advised />
      
      {/* Sezione "Analisi" */}
      <Analyses />

      {/* Sezione "Risorse" */}
      <Resources />
      
      {/* Sezione "Attività" */}
      <Activity />

      {/* Sezione "Esperienze" */}
      <Experiences profile={profile} />

      {/* Sezione "Competenze" */}
      <Skills />
    </> 
  );
};

export default UserProfile;
