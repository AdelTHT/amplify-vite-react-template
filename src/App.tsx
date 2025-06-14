import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { listCars } from './graphql/queries'; // Liste des voitures
import { createReservation } from './graphql/mutations'; // Création d'une réservation

const client = generateClient();

function App() {
  const { signOut } = useAuthenticator();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [reservationDate, setReservationDate] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await API.graphql(graphqlOperation(listCars));
        setCars(data.data.listCars.items);
      } catch (error) {
        console.error("Error fetching cars", error);
      }
    };

    fetchCars();
  }, []);

  const handleReservation = async () => {
    if (!selectedCar || !reservationDate) {
      alert("Sélectionnez une voiture et une date de réservation");
      return;
    }

    const reservationData = {
      carId: selectedCar,
      date: reservationDate,
    };

    try {
      await API.graphql(graphqlOperation(createReservation, { input: reservationData }));
      alert("Réservation réussie !");
    } catch (error) {
      console.error("Error creating reservation", error);
      alert("Erreur lors de la réservation");
    }
  };

  return (
    <div>
      <h1>Gestion de Location de Voitures</h1>
      <button onClick={signOut}>Déconnexion</button>

      <h2>Voitures Disponibles</h2>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.marque} {car.modele} ({car.annee}) - {car.prix}€/jour
            <button onClick={() => setSelectedCar(car.id)}>Réserver</button>
          </li>
        ))}
      </ul>

      {selectedCar && (
        <div>
          <h3>Réserver une voiture</h3>
          <input
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            required
          />
          <button onClick={handleReservation}>Réserver</button>
        </div>
      )}
    </div>
  );
}

export default App;
