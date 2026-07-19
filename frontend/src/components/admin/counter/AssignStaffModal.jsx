import { useState } from "react";

import "./AssignStaffModal.css";


const AssignStaffModal = ({
    counter,
    staffs,
    onClose,
    onAssign
}) => {


    const [selectedStaff, setSelectedStaff] = useState(
        counter?.staffId?._id || ""
    );




    const handleSubmit = (e) => {

        e.preventDefault();



        if(!selectedStaff){

            alert("Vui lòng chọn nhân viên.");

            return;

        }



        onAssign(selectedStaff);

    };





    return (

        <div className="assign-modal-overlay">


            <div className="assign-modal">


                <h3>
                    Phân công nhân viên
                </h3>



                <p className="assign-counter-name">

                    Quầy:

                    <strong>
                        {" "}
                        {counter.counterName}
                    </strong>

                </p>





                <form onSubmit={handleSubmit}>



                    <label>
                        Nhân viên phụ trách
                    </label>



                    <select

                        value={selectedStaff}

                        onChange={(e)=>
                            setSelectedStaff(e.target.value)
                        }

                    >


                        <option value="">
                            -- Chọn nhân viên --
                        </option>




                        {
                            staffs.map((staff)=>(

                                <option

                                    key={staff._id}

                                    value={staff._id}

                                >

                                    {staff.fullName}
                                    {" - "}
                                    {staff.email}

                                </option>

                            ))
                        }


                    </select>







                    <div className="assign-modal-actions">


                        <button

                            type="button"

                            onClick={onClose}

                        >

                            Hủy

                        </button>




                        <button

                            type="submit"

                        >

                            Phân công

                        </button>



                    </div>




                </form>



            </div>


        </div>

    );

};


export default AssignStaffModal;