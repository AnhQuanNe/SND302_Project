import Counter from "../models/Counter.js";
import User from "../models/User.js";

/**
 * Lấy danh sách tất cả quầy
 */
export const getAllCounters = async () => {
  return await Counter.find()
    .populate("staffId", "fullName email status")
    .sort({ createdAt: 1 });
};

/**
 * Tạo quầy mới
 */
export const createCounter = async (data) => {

  const { counterName } = data;


  // Kiểm tra trùng tên quầy
  const existingCounter = await Counter.findOne({
    counterName
  });


  if (existingCounter) {
    throw new Error("Tên quầy đã tồn tại.");
  }


  const counter = await Counter.create({
    counterName
  });


  return counter;
};

/**
 * Cập nhật thông tin quầy
 */
export const updateCounter = async (id, data) => {

    const counter = await Counter.findById(id);

    if (!counter) {
        throw new Error("Không tìm thấy quầy.");
    }


    if (data.counterName) {

        const existingCounter = await Counter.findOne({
            counterName: data.counterName,
            _id: { $ne: id }
        });


        if (existingCounter) {
            throw new Error("Tên quầy đã tồn tại.");
        }
    }


    return await Counter.findByIdAndUpdate(
        id,
        data,
        {
            new:true
        }
    );
};

/**
 * Phân công nhân viên vào quầy
 */
export const assignStaffToCounter = async (counterId, staffId) => {

    // Kiểm tra quầy tồn tại
    const counter = await Counter.findById(counterId);

    if (!counter) {
        throw new Error("Không tìm thấy quầy.");
    }


    // Kiểm tra staff tồn tại
    const staff = await User.findById(staffId);

    if (!staff) {
        throw new Error("Không tìm thấy nhân viên.");
    }


    // Kiểm tra role staff
    if (staff.role !== "staff") {
        throw new Error("Người dùng được chọn không phải nhân viên.");
    }

    // Kiểm tra staff đã ở quầy khác chưa
    const assignedCounter = await Counter.findOne({
        staffId: staffId,
        _id: { $ne: counterId }
    });


    if (assignedCounter) {
        throw new Error(
            `Nhân viên này đang được phân công tại quầy ${assignedCounter.counterName}.`
        );
    }

    // Gán nhân viên vào quầy
    counter.staffId = staffId;

    await counter.save();


    return await Counter.findById(counterId)
        .populate("staffId", "fullName email status");
};

export const deleteCounter = async(counterId)=>{

    const counter = await Counter.findById(counterId);


    if(!counter){
        throw new Error("Không tìm thấy quầy.");
    }


    counter.isActive = false;
    counter.status = "closed";


    await counter.save();


    return counter;
};

/**
 * Lấy chi tiết một quầy
 */
export const getCounterById = async (counterId) => {

    const counter = await Counter.findById(counterId)
        .populate("staffId", "fullName email status");


    if (!counter) {
        throw new Error("Không tìm thấy quầy.");
    }


    return counter;
};