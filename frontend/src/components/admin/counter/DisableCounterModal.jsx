import "./DisableCounterModal.css";


const DisableCounterModal = ({
    counter,
    onClose,
    onDisable
}) => {


    return (

        <div className="disable-modal-overlay">


            <div className="disable-modal">


                <h3>
                    Khóa quầy
                </h3>



                <p>

                    Bạn có chắc muốn khóa quầy:

                    <strong>
                        {" "}
                        {counter.counterName}
                    </strong>

                    ?

                </p>



                <p className="disable-warning">

                    Sau khi khóa, quầy sẽ không còn hoạt động
                    nhưng dữ liệu vẫn được giữ lại.

                </p>





                <div className="disable-modal-actions">


                    <button

                        className="cancel-disable-btn"

                        onClick={onClose}

                    >

                        Hủy

                    </button>




                    <button

                        className="confirm-disable-btn"

                        onClick={onDisable}

                    >

                        Khóa quầy

                    </button>



                </div>



            </div>


        </div>

    );

};


export default DisableCounterModal;