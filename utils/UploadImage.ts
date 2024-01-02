import axios from "axios";

interface Error {
  error: boolean;
  message: string;
  status: number | undefined;
}

export const UploadImage = async (image: File) => {
  let imageUpload: Error = {
    error: false,
    message: "",
    status: undefined,
  };

  let pathDisplay = "";
  let imageLink = "";

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const imageName = `${Date.now()}-${image.name}`;

  const urlUpload = "https://content.dropboxapi.com/2/files/upload";
  const pathUpload =
    '{"path": "' +
    "/test202310" +
    "/" +
    imageName +
    '","mode": "add","autorename": true,"mute": false}';

  const upload = await axios.post(urlUpload, buffer, {
    headers: {
      Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": pathUpload,
    },
  });

  pathDisplay = upload.data.path_display;

  if (!pathDisplay) {
    (imageUpload.error = true),
      (imageUpload.message = "Image failed to upload"),
      (imageUpload.status = 400);

    return { imageUpload, imageLink, pathDisplay };
  } else {
    const urlGet =
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";

    const pathGet =
      '{"path":"' +
      pathDisplay +
      '","settings":{"access":"viewer","allow_download":true,"audience":"public","requested_visibility":"public"}}';

    const getImageLink = await axios.post(urlGet, pathGet, {
      headers: {
        Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    imageLink = getImageLink.data.url;

    return { imageUpload, imageLink, pathDisplay };
  }
};
