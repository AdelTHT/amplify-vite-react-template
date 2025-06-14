import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [cars, setCars] = useState<Array<Schema["Car"]["type"]>>([]);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [reservationDate, setReservationDate] = useState<string>("");

  useEffect(() => {
    client.models.Car.observeQuery().subscribe({
      next: (data) => setCars([...data.items]),
    });
  }, []);

  function createReservation() {
    if (!selectedCar || !reservationDate) {
      alert("Veuillez sélectionner une voiture et une date.");
      return;
    }

    client.models.Reservation.create({ 
      carId: selectedCar, 
      date: reservationDate 
    });
  }

  function deleteCar(id: string) {
    client.models.Car.delete({ id });
  }

  return (
    <main>
      <h1>Gestion de Location de Voitures</h1>
      <div>
        <h2>Voitures Disponibles</h2>
        <ul>
          {cars.map((car: any) => (
            <li key={car.id}>
              {car.marque} {car.modele} ({car.annee}) - {car.prix}€/jour
              <button onClick={() => setSelectedCar(car.id)}>Réserver</button>
              <button onClick={() => deleteCar(car.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedCar && (
        <div>
          <h3>Réserver la voiture</h3>
          <label>
            Date de réservation :
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              required
            />
          </label>
          <button onClick={createReservation}>Réserver</button>
        </div>
      )}

      <div>
        <button onClick={signOut}>Déconnexion</button>
      </div>
    </main>
  );
}

export default App;
