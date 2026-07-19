import { useEffect, useState } from "react";

import "./EditCounterModal.css";


const EditCounterModal = ({
    counter,
    onClose,
    onUpdate
}) => {


    const [counterName, setCounterName] = useState("");

    const [status, setStatus] = useState("open");



    // Load dữ liệu quầy cần sửa
    useEffect(() => {

        if(counter){

            setCounterName(counter.counterName);

            setStatus(counter.status);

        }

    }, [counter]);




    const handleSubmit = (e) => {

        e.preventDefault();



        if(!counterName.trim()){

            alert("Vui lòng nhập tên quầy.");

            return;

        }



        onUpdate({

            counterName,

            status

        });

    };





    return (

        <div className="edit-modal-overlay">


            <div className="edit-modal">


                <h3>
                    Cập nhật quầy
                </h3>




                <form onSubmit={handleSubmit}>


                    <label>
                        Tên quầy
                    </label>


                    <input

                        type="text"

                        value={counterName}

                        onChange={(e)=>
                            setCounterName(e.target.value)
                        }

                        placeholder="Nhập tên quầy"

                    />




                    <label>
                        Trạng thái
                    </label>


                    <select

                        value={status}

                        onChange={(e)=>
                            setStatus(e.target.value)
                        }

                    >

                        <option value="open">
                            Open
                        </option>


                        <option value="closed">
                            Closed
                        </option>


                    </select>





                    <div className="edit-modal-actions">


                        <button

                            type="button"

                            onClick={onClose}

                        >
                            Hủy
                        </button>



                        <button

                            type="submit"

                        >
                            Lưu thay đổi
                        </button>


                    </div>



                </form>



            </div>


        </div>

    );

};


export default EditCounterModal;