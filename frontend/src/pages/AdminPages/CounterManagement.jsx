import { useEffect, useState } from "react";
import "./CounterManagement.css";

import {
    getCounters,
    getCounterDetail,
    createCounter,
    updateCounter,
    assignStaff,
    disableCounter
} from "../../services/counter.service";

import {
    getStaffList
} from "../../services/user.service";

import CounterTable from "../../components/admin/counter/CounterTable";
import CreateCounterModal from "../../components/admin/counter/CreateCounterModal";
import EditCounterModal from "../../components/admin/counter/EditCounterModal";
import AssignStaffModal from "../../components/admin/counter/AssignStaffModal";
import CounterDetailModal from "../../components/admin/counter/CounterDetailModal";
import DisableCounterModal from "../../components/admin/counter/DisableCounterModal";

const CounterManagement = () => {


    const [counters, setCounters] = useState([]);

    const [staffs, setStaffs] = useState([]);

    const [loading, setLoading] = useState(true);

    // Quản lý modal tạo quầy
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Quản lý modal sửa quầy
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCounter, setSelectedCounter] = useState(null);

    // Quản lý modal phân công nhân viên
    const [showAssignModal, setShowAssignModal] = useState(false);
    // Quản lý modal xem chi tiết quầy
    const [showDetailModal, setShowDetailModal] = useState(false);
    // Quản lý modal khóa quầy
    const [showDisableModal, setShowDisableModal] = useState(false);


    // Load danh sách quầy
    useEffect(() => {

        fetchCounters();

    }, []);



    const fetchCounters = async () => {

        try {

            const response = await getCounters();

            setCounters(response.data.data);


        } catch (error) {

            console.log(
                "Lỗi lấy danh sách quầy:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    // Tạo quầy mới
    const handleCreateCounter = async (data) => {

        try {

            await createCounter(data);


            // đóng modal
            setShowCreateModal(false);


            // load lại danh sách
            fetchCounters();


        } catch (error) {

            console.log(
                "Lỗi tạo quầy:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Tạo quầy thất bại."
            );
        }

    };

    // ==========================
    // OPEN EDIT MODAL
    // ==========================

    const handleOpenEdit = (counter) => {


        setSelectedCounter(counter);


        setShowEditModal(true);

    };

    const handleOpenAssign = async (counter) => {

        try {

            const response = await getStaffList();

            setStaffs(response.data.data);


            setSelectedCounter(counter);

            setShowAssignModal(true);


        } catch (error) {

            console.log(
                "Lỗi lấy danh sách staff:",
                error
            );

            alert(
                "Không thể lấy danh sách nhân viên."
            );

        }

    };

    const handleViewDetail = async (counter) => {

        try {


            const response = await getCounterDetail(
                counter._id
            );


            setSelectedCounter(
                response.data.data
            );


            setShowDetailModal(true);


        } catch (error) {


            console.log(
                "Lỗi lấy chi tiết quầy:",
                error
            );


            alert(
                "Không thể lấy thông tin quầy."
            );


        }

    };

    const handleOpenDisable = (counter) => {

        setSelectedCounter(counter);

        setShowDisableModal(true);

    };

    const handleAssignStaff = async (staffId) => {

        try {


            await assignStaff(
                selectedCounter._id,
                staffId
            );


            setShowAssignModal(false);

            setSelectedCounter(null);


            fetchCounters();



        } catch (error) {


            console.log(
                "Lỗi phân công nhân viên:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Phân công thất bại."
            );

        }

    };

    const handleDisableCounter = async () => {

        try {

            await disableCounter(
                selectedCounter._id
            );


            setShowDisableModal(false);

            setSelectedCounter(null);


            fetchCounters();


            alert(
                "Khóa quầy thành công."
            );


        } catch (error) {

            console.log(
                "Lỗi khóa quầy:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Khóa quầy thất bại."
            );

        }

    };

    // ==========================
    // UPDATE COUNTER
    // ==========================

    const handleUpdateCounter = async (data) => {


        try {


            await updateCounter(
                selectedCounter._id,
                data
            );



            setShowEditModal(false);


            setSelectedCounter(null);



            fetchCounters();



        } catch (error) {


            console.log(
                "Lỗi cập nhật quầy:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Cập nhật quầy thất bại."
            );


        }


    };


    if (loading) {
        return (
            <div className="counter-loading">
                Loading counters...
            </div>
        );
    }



    return (

        <div className="counter-management">


            <div className="counter-header">

                <h2>
                    Quản lý quầy phục vụ
                </h2>


                <button onClick={() => setShowCreateModal(true)}>
                    + Thêm quầy
                </button>

            </div>



            <CounterTable
                counters={counters}
                onEdit={handleOpenEdit}
                onAssign={handleOpenAssign}
                onViewDetail={handleViewDetail}
                onDisable={handleOpenDisable}
            />

            {
                showCreateModal && (

                    <CreateCounterModal

                        onClose={() =>
                            setShowCreateModal(false)
                        }

                        onCreate={handleCreateCounter}

                    />

                )
            }

            {
                showEditModal && selectedCounter && (

                    <EditCounterModal


                        counter={selectedCounter}



                        onClose={() => {

                            setShowEditModal(false);

                            setSelectedCounter(null);

                        }}



                        onUpdate={handleUpdateCounter}


                    />

                )
            }

            {
                showAssignModal && selectedCounter && (

                    <AssignStaffModal

                        counter={selectedCounter}

                        staffs={staffs}

                        onClose={() => {

                            setShowAssignModal(false);

                            setSelectedCounter(null);

                        }}

                        onAssign={handleAssignStaff}

                    />

                )
            }

            {
                showDetailModal && selectedCounter && (

                    <CounterDetailModal

                        counter={selectedCounter}

                        onClose={() => {

                            setShowDetailModal(false);

                            setSelectedCounter(null);

                        }}

                    />

                )
            }

            {
                showDisableModal && selectedCounter && (

                    <DisableCounterModal

                        counter={selectedCounter}

                        onClose={() => {

                            setShowDisableModal(false);

                            setSelectedCounter(null);

                        }}

                        onDisable={handleDisableCounter}

                    />

                )
            }



        </div>

    );
};


export default CounterManagement;