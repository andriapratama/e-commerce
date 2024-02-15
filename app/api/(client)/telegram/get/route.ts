import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const message = "1 order belum dibuka.";

    await axios.get(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}`
    );

    return NextResponse.json(
      { message: "Notification has been sent" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[TELEGRAM_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
