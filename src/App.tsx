import { useEffect, useState } from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { listCars } from './graphql/queries'; // Liste des voitures

function App() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await API.graphql(graphqlOperation(listCars));
        setCars(data.data.listCars.items); // On met à jour les voitures
      } catch (error) {
        console.error("Error fetching cars", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div>
      <h1>Liste des Voitures</h1>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            {car.marque} {car.modele} ({car.annee}) - {car.prix}€/jour
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
