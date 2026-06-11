import ServiceList from "../../components/customer/ServiceList";

function Dashboard() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">
        Customer Dashboard
      </h1>

      <ServiceList />
    </div>
  );
}

export default Dashboard;