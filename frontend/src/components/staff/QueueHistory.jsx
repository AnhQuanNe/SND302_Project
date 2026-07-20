import { useEffect, useState } from "react";

import {
    getStaffHistory
} from "../../services/staff.service";

import "./QueueHistory.css";


const QueueHistory = () => {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    const loadHistory = async () => {

        try {

            setLoading(true);

            const res = await getStaffHistory();

            setHistory(res.data.data);


        } catch(error){

            console.error(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(()=>{

        loadHistory();

    },[]);



    if(loading){

        return (
            <div>
                Loading history...
            </div>
        );

    }


    return (

        <div className="queue-history">


            <h3>
                Lịch sử xử lý
            </h3>


            <table>

                <thead>

                    <tr>
                        <th>Queue</th>
                        <th>Khách hàng</th>
                        <th>Dịch vụ</th>
                        <th>Quầy</th>
                        <th>Thời gian</th>
                        <th>Duration</th>
                    </tr>

                </thead>


                <tbody>


                {
                    history.map(item=>(

                        <tr key={item._id}>

                            <td>
                                A{String(item.queueNumber)
                                .padStart(3,"0")}
                            </td>


                            <td>
                                {item.userId?.fullName}
                            </td>


                            <td>
                                {item.serviceId?.name}
                            </td>


                            <td>
                                {
                                    item.counterId
                                    ?
                                    item.counterId.counterName
                                    :
                                    "-"
                                }
                            </td>


                            <td>
                                {
                                  new Date(item.servedAt)
                                  .toLocaleString()
                                }
                            </td>


                            <td>
                                {item.duration}s
                            </td>


                        </tr>

                    ))
                }


                </tbody>

            </table>


        </div>

    );
};


export default QueueHistory;