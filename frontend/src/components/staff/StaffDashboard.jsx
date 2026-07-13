import { useEffect, useState } from "react";

import {
  getCurrentQueue,
  getCounterInfo,
  getSkippedQueues,
} from "../../services/staff.service";

import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Loading from "../common/Loading";

import CounterCard from "./CounterCard";
import CurrentQueue from "./CurrentQueue";
import StaffActions from "./StaffActions";
import SkippedQueueList from "./SkippedQueueList";

import "./StaffDashboard.css";

const StaffDashboard = () => {
  const [counter, setCounter] = useState(null);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skippedQueues, setSkippedQueues] = useState([]);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear(); // 🔥 xoá sạch

    window.location.href = "/";
  };

  // ===============================
  // Load dữ liệu
  // ===============================
  const loadData = async () => {
    try {
      setLoading(true);

      const [counterRes, queueRes, skippedRes] = await Promise.allSettled([
        getCounterInfo(),
        getCurrentQueue(),
        getSkippedQueues(),
      ]);

      if (counterRes.status === "fulfilled") {
        setCounter(counterRes.value.data.data);
      }

      if (queueRes.status === "fulfilled") {
        setCurrentQueue(queueRes.value.data.data);
      } else {
        // Không có khách đang phục vụ
        setCurrentQueue(null);
      }

      // Danh sách khách đã Skip
      if (skippedRes.status === "fulfilled") {
        setSkippedQueues(skippedRes.value.data.data);
      } else {
        setSkippedQueues([]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar
        logoText="SMART QUEUE"
        user={currentUser}
        onLogout={handleLogout}
      />

      <div className="staff-dashboard">

        <h2 className="staff-title">
          Staff Dashboard
        </h2>

        <div className="staff-top">

          <CounterCard counter={counter} />

          <CurrentQueue queue={currentQueue} />

        </div>

        <StaffActions
          queue={currentQueue}
          counter={counter}
          reload={loadData}
        />

        <SkippedQueueList
          queues={skippedQueues}
          reload={loadData}
        />

      </div>

      <Footer />
    </>
  );
};

export default StaffDashboard;