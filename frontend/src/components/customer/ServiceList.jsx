import { useEffect, useState } from "react";
import axios from "axios";

function ServiceList() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/service"
    );

    setServices(res.data);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-5">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white p-5 shadow rounded"
        >
          <h2 className="font-bold text-xl">
            {service.name}
          </h2>

          <p>{service.description}</p>

          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Get Queue
          </button>
        </div>
      ))}
    </div>
  );
}

export default ServiceList;