import { MediaCaption } from "@/components/media-caption";

const config = {
  title: "Components/MediaCaption",
  component: MediaCaption,
  parameters: {
    layout: "centered",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
    className: { control: false },
  },
};

export default config;

const image = {
  src: "https://picsum.photos/seed/media/1000/1000",
  height: 1000,
  width: 1000,
  alt: "Placeholder image",
};

const video = {
  src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
  title: "Why Choose U of G? - Banky",
  transcript:
    "https://preview-ugconthub.netlify.app/_gatsby/file/698e52bbf7d24a15d69d4a3c46c326ce/Banky_Why_Choose_U_of_G_Visual_Transcript.txt?url=https%3A%2F%2Fapi.liveugconthub.uoguelph.dev%2Fsites%2Fdefault%2Ffiles%2F2021-06%2FBanky_Why_Choose_U_of_G_Visual_Transcript.txt&cd=307f9699436c68e4c4b41f02e6e2946e",
}

const Body = () => (
  <p>
    Error officia iure dicta illum. Corporis in cum porro excepturi officiis nesciunt a. Neque velit dolores impedit
    fugiat quae alias. Corporis voluptas delectus error veritatis labore quae magnam eos sequi. Et dicta aut nulla
    commodi voluptatem rerum. Porro voluptatum quibusdam quo incidunt. Rem dignissimos rerum laboriosam cumque. Nisi
    quasi occaecati esse exercitationem asperiores nam. Ex vero voluptatibus animi. Explicabo numquam reprehenderit ipsa
    unde ad. Maxime dolor illum minima nam perspiciatis autem. Necessitatibus vitae molestias. Dolorem amet provident
    molestias dolorum esse asperiores. Ipsa atque sunt neque deserunt in incidunt sed. Vitae occaecati accusantium iure
    doloremque voluptas deleniti enim officia. Distinctio nulla vero quas quam doloremque distinctio sit repellendus
    itaque. Itaque itaque esse.
  </p>
);

export const SmallImageLeft = {
  args: {
    media: image,
    size: "small",
    position: "left",
    children: <Body />,
  },
};

export const MediumImageLeft = {
  args: {
    media: image,
    size: "medium",
    position: "left",
    children: <Body />,
  },
};

export const LargeImageLeft = {
  args: {
    media: image,
    size: "large",
    position: "left",
    children: <Body />,
  },
};

export const SmallImageRight = {
  args: {
    media: image,
    size: "small",
    position: "right",
    children: <Body />,
  },
};

export const MediumImageRight = {
  args: {
    media: image,
    size: "medium",
    position: "right",
    children: <Body />,
  },
};

export const LargeImageRight = {
  args: {
    media: image,
    size: "large",
    position: "right",
    children: <Body />,
  },
};

export const ImageAbove = {
  args: {
    media: image,
    position: "above",
    className: "w-96",
    children: <Body />,
  },
};

export const MediumVideoLeft = {
  args: {
    media: video,
    size: "medium",
    position: "left",
    children: <Body />,
  },
};

export const LargeVideoLeft = {
  args: {
    media: video,
    size: "large",
    position: "left",
    children: <Body />,
  },
};

export const MediumVideoRight = {
  args: {
    media: video,
    size: "medium",
    position: "right",
    children: <Body />,
  },
};

export const LargeVideoRight = {
  args: {
    media: video,
    size: "large",
    position: "right",
    children: <Body />,
  },
};

export const VideoAbove = {
  args: {
    media: video,
    position: "above",
    children: <Body />,
  },
};

export const LightBlueBG = {
  args: {
    media: image,
    position: "above",
    background: "light-blue",
    className: "w-96",
    children: <Body />,
  },
};

export const DarkGreyBG = {
  args: {
    media: image,
    position: "above",
    background: "dark-grey",
    className: "w-96",
    children: <Body />,
  },
};
