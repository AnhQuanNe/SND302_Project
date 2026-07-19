import "./CounterTable.css";

const CounterTable = ({
    counters,
    onEdit,
    onAssign,
    onViewDetail,
    onDisable
}) => {


    return (

        <div className="counter-table-wrapper">

            <table className="counter-table">

                <thead>

                    <tr>

                        <th>
                            Tên quầy
                        </th>


                        <th>
                            Nhân viên
                        </th>


                        <th>
                            Trạng thái
                        </th>


                        <th>
                            Hoạt động
                        </th>

                        <th>
                            Thao tác
                        </th>


                    </tr>

                </thead>


                <tbody>


                    {
                        counters.map((counter) => (

                            <tr key={counter._id}>


                                <td>
                                    {counter.counterName}
                                </td>


                                <td>

                                    {
                                        counter.staffId
                                            ?
                                            counter.staffId.fullName
                                            :
                                            "Chưa phân công"
                                    }

                                </td>


                                <td>

                                    <span
                                        className={
                                            `counter-status ${counter.status === "open"
                                                ? "status-open"
                                                : "status-closed"
                                            }`
                                        }
                                    >
                                        {counter.status}
                                    </span>

                                </td>


                                <td>

                                    <span
                                        className={
                                            counter.isActive
                                                ?
                                                "counter-active active"
                                                :
                                                "counter-active disabled"
                                        }
                                    >

                                        {
                                            counter.isActive
                                                ?
                                                "Active"
                                                :
                                                "Disabled"
                                        }

                                    </span>

                                </td>

                                <td>

                                    <div className="counter-action-group">
                                        <button

                                            className="detail-counter-btn"

                                            onClick={() => onViewDetail(counter)}

                                        >

                                            Chi tiết

                                        </button>



                                        <button

                                            className="edit-counter-btn"

                                            onClick={() => onEdit(counter)}

                                        >

                                            Sửa

                                        </button>



                                        <button

                                            className="assign-counter-btn"

                                            onClick={() => onAssign(counter)}

                                        >

                                            Phân công

                                        </button>

                                        <button

                                            className="disable-counter-btn"

                                            onClick={() => onDisable(counter)}

                                        >

                                            Khóa

                                        </button>

                                    </div>
                                </td>



                            </tr>

                        ))
                    }


                </tbody>


            </table>

        </div>

    );

};


export default CounterTable;