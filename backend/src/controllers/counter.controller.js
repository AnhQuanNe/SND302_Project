import { 
    getAllCounters,
    getCounterById,
    createCounter,
    updateCounter,
    assignStaffToCounter,
    deleteCounter
} from "../services/counter.service.js";

/**
 * GET /api/counters
 */
export const getCounters = async (req, res) => {
  try {
    const counters = await getAllCounters();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách quầy thành công.",
      data: counters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/counters/:id
 */
export const getCounterDetail = async (req, res) => {

    try {

        const counter = await getCounterById(
            req.params.id
        );


        return res.status(200).json({
            success:true,
            message:"Lấy thông tin quầy thành công.",
            data:counter
        });


    } catch(error) {

        return res.status(404).json({
            success:false,
            message:error.message
        });

    }
};

/**
 * POST /api/counters/newCounter
 */
export const createCounterController = async (req,res)=>{
    try{

        const counter = await createCounter(req.body);

        return res.status(201).json({
            success:true,
            message:"Tạo quầy thành công.",
            data:counter
        });


    }catch(error){

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }
};

/**
 * PUT /api/counters/:id
 */
export const updateCounterInfo = async (req, res) => {
  try {

    const counter = await updateCounter(
      req.params.id,
      req.body
    );


    return res.status(200).json({
      success: true,
      message: "Cập nhật quầy thành công.",
      data: counter,
    });


  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * PUT /api/counters/:id/assign-staff
 */
export const assignStaff = async (req, res) => {

    try {

        const { staffId } = req.body;


        const counter = await assignStaffToCounter(
            req.params.id,
            staffId
        );


        return res.status(200).json({
            success:true,
            message:"Phân công nhân viên vào quầy thành công.",
            data:counter
        });


    } catch(error) {

        return res.status(400).json({
            success:false,
            message:error.message
        });

    }
};

/**
 * DELETE /api/counters/:id
 * Khóa quầy (soft delete)
 */
export const deleteCounterInfo = async (req, res) => {

    try {

        const counter = await deleteCounter(
            req.params.id
        );


        return res.status(200).json({
            success: true,
            message: "Khóa quầy thành công.",
            data: counter
        });


    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};