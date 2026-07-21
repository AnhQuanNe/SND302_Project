import { useEffect, useState } from "react";

import {
  getServices,
  createQueue,
  getMyQueue,
  cancelQueue,
} from "../../services/queue.service";

import {
  getNotifications
} from "../../services/notification.service";

import useSocket from "../../hooks/useSocket";

import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

import ActiveTicket from "./ActiveTicket";
import ServiceList from "./ServiceList";
import Loading from "../common/Loading";
import Profile from "./Profile";
import Feedback from "./Feedback";
import ServicesCatalog from "./ServicesCatalog";

import "./CustomerDashboard.css";


const CustomerDashboard = () => {


  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentQueue, setCurrentQueue] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [activeView, setActiveView] = useState("dashboard");


  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );



  // =========================
  // Reload Queue
  // =========================

  const reloadQueue = async () => {

    try {

      const res = await getMyQueue();

      setCurrentQueue(res.data ?? null);


    } catch(err){

      console.error(
        "Reload queue error:",
        err
      );


      if(err.response?.status === 404){

        setCurrentQueue(null);

      }

    }

  };



  // =========================
  // Reload Notification
  // =========================

  const reloadNotifications = async () => {

    try {

      const res = await getNotifications();

      setNotifications(
        res.data || []
      );


    } catch(err){

      console.error(
        "Notification error:",
        err
      );

    }

  };



  // =========================
  // Socket realtime
  // =========================

  useSocket(
    currentUser,
    reloadQueue,
    reloadNotifications
  );




  // =========================
  // Initial Load
  // =========================

  useEffect(() => {


    const fetchData = async () => {

      try {


        const resService = await getServices();


        setServices(
          Array.isArray(resService.data)
          ? resService.data
          : []
        );



        const resQueue = await getMyQueue();


        setCurrentQueue(
          resQueue.data || null
        );



        await reloadNotifications();



      }catch(err){

        console.error(err);


      }finally{

        setLoading(false);

      }

    };



    fetchData();



    const handleStorageChange = () => {

      setCurrentUser(
        JSON.parse(
          localStorage.getItem("user") || "{}"
        )
      );

    };



    window.addEventListener(
      "storage",
      handleStorageChange
    );



    const interval = setInterval(async()=>{

      await reloadQueue();

      await reloadNotifications();


    },5000);



    return ()=>{


      window.removeEventListener(
        "storage",
        handleStorageChange
      );


      clearInterval(interval);


    };



  },[]);






  // =========================
  // Create Queue
  // =========================

  const handleCreateQueue = async(serviceId)=>{


    if(currentQueue){

      alert(
        "⚠️ Bạn đang có một vé xếp hàng hoạt động. Vui lòng hoàn thành hoặc huỷ vé hiện tại trước khi đăng ký vé mới."
      );

      return;

    }



    try{


      const res = await createQueue(serviceId);



      alert(
`🎟️ Số của bạn: ${res.data.number}

⏱️ Thời gian chờ dự kiến:
${Math.round(res.data.predictedWaitTime)} phút`
      );



      await reloadQueue();

      await reloadNotifications();



    }catch(err){


      console.error(err);


      alert(
        err.response?.data?.message ||
        "❌ Lấy vé thất bại. Vui lòng thử lại sau."
      );

    }


  };





  // =========================
  // Cancel Queue
  // =========================

  const handleCancelQueue = async()=>{


    if(!currentQueue)
      return;



    if(window.confirm("Bạn có chắc muốn huỷ vé không?")){


      try{


        await cancelQueue(
          currentQueue._id
        );


        await reloadQueue();

        await reloadNotifications();



      }catch(err){


        console.error(err);

        alert(
          "❌ Huỷ vé thất bại"
        );


      }


    }


  };






  // =========================
  // Logout
  // =========================

  const handleLogout = ()=>{


    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.clear();


    window.location.href="/";


  };







  // =========================
  // Get Service Of Ticket
  // =========================

  const getActiveQueueService = ()=>{


    if(!currentQueue)
      return null;



    if(
      currentQueue.serviceId &&
      typeof currentQueue.serviceId === "object"
    ){

      return currentQueue.serviceId;

    }



    return services.find(
      service =>
        String(service._id)
        ===
        String(currentQueue.serviceId)

    ) || null;



  };



  const activeService =
    getActiveQueueService();






  const navItems = [

    {
      label:"Home",
      active: activeView==="dashboard",
      onClick:()=>setActiveView("dashboard")
    },


    {
      label:"Services",
      active:false,
      onClick:()=>setActiveView("services")
    },


    {
      label:"Track Queue",
      active:false,
      onClick:()=>setActiveView("track")
    },


    {
      label:"Feedback",
      active:activeView==="feedback",
      onClick:()=>setActiveView("feedback")
    }

  ];





  return (

    <div className="dashboard-container">


      <Navbar

        logoText="SMART QUEUE"

        user={currentUser}

        notifications={notifications}

        onLogout={handleLogout}

        onProfileClick={()=>
          setActiveView("profile")
        }

        navItems={navItems}

      />



      <main className="dashboard-main">


        {
        activeView==="profile"

        ?

        <Profile
          onBack={()=>
            setActiveView("dashboard")
          }
        />


        :

        activeView==="feedback"

        ?

        <Feedback />


        :

        activeView==="track"

        ?

        <section className="track-queue-section">

          <h2>
            Theo dõi vé của bạn
          </h2>


          {
          currentQueue

          ?

          <ActiveTicket

            queue={currentQueue}

            service={activeService}

            onCancel={handleCancelQueue}

          />


          :

          <div className="empty-queue-message">

            Bạn chưa có vé nào.

          </div>

          }


        </section>


        :

        activeView==="services"

        ?

        <ServicesCatalog

          services={services}

          onBook={handleCreateQueue}

          loading={loading}

        />


        :


        <>


        <section className="hero-banner">

          <h1>

          Xin chào,
          {" "}
          <span className="hero-highlight">

          {currentUser?.fullName || "bạn"}

          </span>

          !

          </h1>


        </section>





        {
        currentQueue

        ?

        <ActiveTicket

          key={currentQueue._id}

          queue={currentQueue}

          service={activeService}

          onCancel={handleCancelQueue}

        />


        :

        <div className="no-active-ticket">

          Bạn chưa có vé đang hoạt động.

        </div>

        }




        <section className="services-section">


        {
        loading

        ?

        <Loading

          type="spinner"

          message="Đang tải danh sách dịch vụ..."

        />


        :

        <ServiceList

          services={services}

          onBook={handleCreateQueue}

        />

        }


        </section>


        </>


        }


      </main>



      <Footer />


    </div>

  );


};


export default CustomerDashboard;