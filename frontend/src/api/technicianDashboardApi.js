import axiosInstance from "./axiosInstance";

export const getAssignedComplaints = async () => {
  const res = await axiosInstance.get(
    "/technician-dashboard/assigned-complaints",
  );
  return res.data || [];
};

export const updateComplaintStatus = async (complaintId, payload) => {
  const res = await axiosInstance.patch(
    `/technician-dashboard/complaints/${complaintId}/status`,
    payload,
  );
  return res.data;
};

export const uploadWorkPhoto = async (complaintId, payload) => {
  const res = await axiosInstance.post(
    `/technician-dashboard/complaints/${complaintId}/work-photo`,
    payload,
  );
  return res.data;
};
