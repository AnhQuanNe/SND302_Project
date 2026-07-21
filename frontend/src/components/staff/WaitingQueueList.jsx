import { useEffect, useState } from "react";
import { getWaitingQueues } from "../../services/staff.service";

import "./WaitingQueueList.css";


const WaitingQueueList = () => {

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);


  const loadQueues = async () => {
    try {

      setLoading(true);

      const res = await getWaitingQueues();

      setQueues(res.data.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadQueues();

  }, []);





  if (loading) {

    return <p>Loading...</p>;

  }



  return (

    <div className="waiting-queue">


      <h3>
        Danh sách hàng chờ
      </h3>



      <table>


        <thead>


          <tr>

            <th>Queue</th>

            <th>Khách hàng</th>

            <th>Dịch vụ</th>

            <th>Trạng thái</th>

            <th>Lấy số lúc</th>

          </tr>


        </thead>



        <tbody>


          {
            queues.length === 0 ? (

              <tr>

                <td colSpan="6">
                  Không có khách đang chờ
                </td>

              </tr>


            ) : (


              queues.map(item => (


                <tr key={item._id}>


                  <td>

                    A{String(item.number)
                      .padStart(3, "0")}

                  </td>



                  <td>

                    {item.userId?.fullName}

                  </td>



                  <td>

                    {item.serviceId?.name}

                  </td>



                  <td>


                    <span

                      className={
                        item.status === "waiting"
                          ? "status waiting"
                          : "status cancelled"
                      }

                    >

                      {item.status}

                    </span>


                  </td>



                  <td>

                    {
                      new Date(item.createdAt)
                        .toLocaleTimeString()
                    }

                  </td>







                </tr>


              ))

            )
          }


        </tbody>


      </table>


    </div>

  );

};


export default WaitingQueueList;