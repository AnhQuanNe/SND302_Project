import { useState } from "react";
import "./CreateCounterModal.css";

const CreateCounterModal = ({
    onClose,
    onCreate
}) => {


    const [counterName, setCounterName] = useState("");



    const handleSubmit = (e) => {

        e.preventDefault();


        if(!counterName.trim()){
            alert("Vui lòng nhập tên quầy.");
            return;
        }


        onCreate({
            counterName
        });


        setCounterName("");

    };



    return (

        <div className="modal-overlay">


            <div className="modal">


                <h3>
                    Tạo quầy mới
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
                        placeholder="Ví dụ: A001"
                    />



                    <div className="modal-actions">


                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Hủy
                        </button>



                        <button
                            type="submit"
                        >
                            Tạo quầy
                        </button>


                    </div>


                </form>


            </div>


        </div>

    );

};


export default CreateCounterModal;