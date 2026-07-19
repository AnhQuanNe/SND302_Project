import "./CounterDetailModal.css";


const CounterDetailModal = ({
    counter,
    onClose
}) => {


    return (

        <div className="counter-detail-overlay">


            <div className="counter-detail-modal">


                <div className="counter-detail-header">

                    <h3>
                        Chi tiết quầy
                    </h3>


                    <button
                        className="counter-detail-close"
                        onClick={onClose}
                    >

                        ×

                    </button>


                </div>



                <div className="counter-detail-body">



                    <div className="detail-row">

                        <span>
                            Tên quầy
                        </span>

                        <strong>
                            {counter.counterName}
                        </strong>

                    </div>




                    <div className="detail-row">

                        <span>
                            Nhân viên phụ trách
                        </span>

                        <strong>

                            {
                                counter.staffId
                                ?
                                counter.staffId.fullName
                                :
                                "Chưa phân công"
                            }

                        </strong>

                    </div>




                    <div className="detail-row">

                        <span>
                            Email nhân viên
                        </span>

                        <strong>

                            {
                                counter.staffId
                                ?
                                counter.staffId.email
                                :
                                "---"
                            }

                        </strong>

                    </div>




                    <div className="detail-row">

                        <span>
                            Trạng thái quầy
                        </span>


                        <span

                            className={
                                counter.status === "open"
                                ?
                                "detail-status open"
                                :
                                "detail-status closed"
                            }

                        >

                            {counter.status}

                        </span>


                    </div>




                    <div className="detail-row">

                        <span>
                            Trạng thái hoạt động
                        </span>


                        <span

                            className={
                                counter.isActive
                                ?
                                "detail-active active"
                                :
                                "detail-active disabled"
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


                    </div>




                    <div className="detail-row">

                        <span>
                            Ngày tạo
                        </span>


                        <strong>

                            {
                                counter.createdAt
                                ?
                                new Date(
                                    counter.createdAt
                                ).toLocaleString("vi-VN")
                                :
                                "---"
                            }

                        </strong>


                    </div>



                </div>




                <div className="counter-detail-footer">


                    <button

                        className="close-detail-btn"

                        onClick={onClose}

                    >

                        Đóng

                    </button>


                </div>



            </div>


        </div>

    );

};


export default CounterDetailModal;