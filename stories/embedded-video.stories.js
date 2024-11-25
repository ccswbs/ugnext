import { Divider } from "@/components/divider";
import { EmbeddedVideo } from "@/components/embedded-video";

const config = {
  title: "Components/EmbeddedVideo",
  component: EmbeddedVideo,
  parameters: {
    layout: "padded",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
};

export default config;

export const Youtube = {
  args: {
    src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
    title: "Why Choose U of G? - Banky",
  },
};

export const Vimeo = {
  args: {
    src: "https://vimeo.com/618992196",
    title: "Improve Life - One Health",
    className: "w-full aspect-[16/9]",
  },
};

export const WithTranscript = {
  args: {
    src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
    title: "Why Choose U of G? - Banky",
    transcript:
      "https://preview-ugconthub.netlify.app/_gatsby/file/698e52bbf7d24a15d69d4a3c46c326ce/Banky_Why_Choose_U_of_G_Visual_Transcript.txt?url=https%3A%2F%2Fapi.liveugconthub.uoguelph.dev%2Fsites%2Fdefault%2Ffiles%2F2021-06%2FBanky_Why_Choose_U_of_G_Visual_Transcript.txt&cd=307f9699436c68e4c4b41f02e6e2946e",
  },
};

export const AsModalWithDefaultButton = {
  args: {
    src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
    title: "Why Choose U of G? - Banky",
    transcript:
      "https://preview-ugconthub.netlify.app/_gatsby/file/698e52bbf7d24a15d69d4a3c46c326ce/Banky_Why_Choose_U_of_G_Visual_Transcript.txt?url=https%3A%2F%2Fapi.liveugconthub.uoguelph.dev%2Fsites%2Fdefault%2Ffiles%2F2021-06%2FBanky_Why_Choose_U_of_G_Visual_Transcript.txt&cd=307f9699436c68e4c4b41f02e6e2946e",
    modal: {
      button: "Play Video",
      type: "red",
    },
  },
};

export const AsModalWithPlayButton = {
  args: {
    src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
    title: "Why Choose U of G? - Banky",
    transcript:
      "https://preview-ugconthub.netlify.app/_gatsby/file/698e52bbf7d24a15d69d4a3c46c326ce/Banky_Why_Choose_U_of_G_Visual_Transcript.txt?url=https%3A%2F%2Fapi.liveugconthub.uoguelph.dev%2Fsites%2Fdefault%2Ffiles%2F2021-06%2FBanky_Why_Choose_U_of_G_Visual_Transcript.txt&cd=307f9699436c68e4c4b41f02e6e2946e",
    modal: {
      type: "play-button",
    },
  },
};
