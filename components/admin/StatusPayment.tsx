export const StatusPayment = (status: "pending" | "paid") => {
  return (
    <div
      className={`px-5 py-3 rounded-full ${
        status === "pending"
          ? "bg-black text-white"
          : "bg-white border border-black text-black"
      }`}
    >
      {status === "pending" ? "belum dibayar" : "selesai"}
    </div>
  );
};
