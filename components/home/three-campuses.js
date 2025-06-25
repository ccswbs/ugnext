import { Card } from "@/components/card";
import guelph from "@/img/guelph.png";
import ridgetown from "@/img/ridgetown.png";
import guelphHumber from "@/img/guelph-humber.png";

export const ThreeCampuses = () => {
  const campuses = [
    {
      title: "Guelph",
      url: "https://www.uoguelph.ca/admission/undergraduate/tours/",
      image: {
        src: guelph.src,
        width: guelph.width,
        height: guelph.height,
        blurred: guelph.blurDataURL,
        alt: "An aerial view of Johnston Hall and the University of Guelph campus",
      },
    },
    {
      title: "Ridgetown",
      url: "https://www.ridgetownc.com/",
      image: {
        src: ridgetown.src,
        width: ridgetown.width,
        height: ridgetown.height,
        blurred: ridgetown.blurDataURL,
        alt: "An aerial view of the Ridgetown Campus",
      },
    },
    {
      title: "Guelph-Humber",
      url: "https://www.guelphhumber.ca/",
      image: {
        src: guelphHumber.src,
        width: guelphHumber.width,
        height: guelphHumber.height,
        blurred: guelphHumber.blurDataURL,
        alt: "The main building of the University of Guelph-Humber campus",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {campuses.map((campus, index) => (
        <Card
          key={campus.title}
          className="h-full"
          title={<span className="my-auto w-full text-uog-color-black text-center text-[2.2rem] font-bold">{`${campus.title} Campus`}</span>}
          href={campus.url}
          centered
          image={{
            ...campus.image,
            className: "aspect-[3/2] w-full",
            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
          }}
        />
      ))}
    </div>
  );
};
