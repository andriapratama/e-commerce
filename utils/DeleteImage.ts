import axios from "axios";

export const DeleteImage = async (imagePathname: string) => {
  const pathDelete = '{"path": "' + imagePathname + '"}';

  const urlDelete = "https://api.dropboxapi.com/2/files/delete_v2";

  await axios.post(urlDelete, pathDelete, {
    headers: {
      Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
  });
};
