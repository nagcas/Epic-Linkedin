import { useState } from "react";
import { Modal } from "react-bootstrap";
import fetchWithAuth from "../services/fetchWithAuth";
// Componente per eliminare un'esperienza lavorativa
function DeleteExperience({authorLogin, experience, fetchExperiences}) {
  // URL per l'API di eliminazione dell'esperienza
  const url = `http://localhost:5000/profile/${authorLogin._id}/experiences/${experience._id}`;

  // Stato per controllare la visibilità del modal
  const [show, setShow] = useState(false);

  // Funzioni per gestire l'apertura e la chiusura del modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Token di autenticazione per l'API
 //  const Token = process.env.TOKEN;

  // Funzione per gestire l'eliminazione dell'esperienza
  const handleElimina = async () => {
    try {
        await fetchWithAuth(url, {
        method: 'DELETE',
      });
        handleClose();
        await fetchExperiences();
       
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      // Qui puoi aggiungere la gestione dell'errore, come mostrare un messaggio all'utente
    }
  };

  return(
    <>
      {/* Pulsante per aprire il modal di conferma eliminazione */}
      <button 
        variant='outline-secondary' 
        className='btn__altro mx-1 mt-3'
        onClick={handleShow}
      >
        Elimina
      </button>

      {/* Modal di conferma eliminazione */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Elimina esperienza</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Vuoi confermare l'eliminazione di questa esperienza?
        </Modal.Body>
        <Modal.Footer>
          {/* Pulsante per chiudere il modal */}
          <button 
            variant="secondary"
            className='btn__altro'
            onClick={handleClose}>
            Chiudi
          </button>
          {/* Pulsante per confermare l'eliminazione */}
          <button 
            variant='outline-primary'
            className='add__btn'
            onClick={handleElimina}>
            Elimina
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteExperience;