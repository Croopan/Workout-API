
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Equipment {
  id: number;
  name: string;
}

interface Muscle {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  images: ExerciseImage[];
  exercise_base: number
}

interface ExerciseImage {
  id: number;
  image: string;
}

const Exercises = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [equipment, setEquipment] = useState<number | undefined>();
    const [muscle, setMuscle] = useState<number | undefined>();
    const [category, setCategory] = useState<number | undefined>();
    const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);
    const [muscleOptions, setMuscleOptions] = useState<Muscle[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

    useEffect(() => {
        axios.get('https://wger.de/api/v2/equipment/')
            .then(response => setEquipmentOptions(response.data.results))
            .catch(error => console.error('Error fetching equipment:', error));

        axios.get('https://wger.de/api/v2/muscle/')
            .then(response => setMuscleOptions(response.data.results))
            .catch(error => console.error('Error fetching muscles:', error));

        axios.get('https://wger.de/api/v2/exercisecategory/')
            .then(response => setCategoryOptions(response.data.results))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const fetchExercises = () => {
        let query = 'https://wger.de/api/v2/exercise/?language=2';
        if (equipment) query += `&equipment=${equipment}`;
        if (muscle) query += `&muscles=${muscle}`;
        if (category) query += `&category=${category}`;

        axios.get(query)
            .then(response => {
                const fetchedExercises = response.data.results;
                const exerciseRequests = fetchedExercises.map((exercise: Exercise) =>
                    axios.get(`https://wger.de/api/v2/exerciseimage/?exercise_base=${exercise.exercise_base}`)
                        .then(imageResponse => ({
                            ...exercise,
                            images: imageResponse.data.results.length > 0 ? imageResponse.data.results : [{ id: -1, image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgIBBHZmAooAAAAASUVORK5CYII=' }]
                        }))
                        .catch((error) => (
                        console.error(error)
                    ))
                );
                return Promise.all(exerciseRequests);
            })
            .then(fullExercises => {console.log(fullExercises); setExercises(fullExercises);} )
            .catch(error => console.error('Error fetching exercises:', error));
    };

    return (
        <div className="container">
            <h1 className="my-4">Exercises</h1>
            <div className="row mb-4">
                <div className="col-md-4">
                    <label>
                        Equipment:
                        <select
                            className="form-control"
                            value={equipment}
                            onChange={e => setEquipment(Number(e.target.value))}
                        >
                            <option value="">Select Equipment</option>
                            {equipmentOptions.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="col-md-4">
                    <label>
                        Muscle:
                        <select
                            className="form-control"
                            value={muscle}
                            onChange={e => setMuscle(Number(e.target.value))}
                        >
                            <option value="">Select Muscle</option>
                            {muscleOptions.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="col-md-4">
                    <label>
                        Category:
                        <select
                            className="form-control"
                            value={category}
                            onChange={e => setCategory(Number(e.target.value))}
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <button className="btn btn-primary mb-4" onClick={fetchExercises}>
                Search
            </button>
            <div className="row">
                {exercises.map(exercise => (
                    <div key={exercise.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            {exercise.images.length > 0 && (
                                <img
                                    src={exercise.images[0].image}
                                    alt={exercise.name}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{exercise.name}</h5>
                                <p className="card-text" dangerouslySetInnerHTML={{ __html: exercise.description }}></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exercises;
