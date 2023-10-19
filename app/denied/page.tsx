"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Denied = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const role = session?.user.role;

  useEffect(() => {
    if (role !== "admin") {
      return router.push("/");
    }

    return router.push("/admin/orders");
  }, [role]);
  return (
    <div className="w-full h-screen flex justify-center items-center text-3xl">
      Access Denied
    </div>
  );
};

export default Denied;
