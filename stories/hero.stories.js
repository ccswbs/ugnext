import { Hero } from "@/components/hero";

const config = {
  title: "Components/Hero",
  component: Hero,
  parameters: {
    layout: "fullScreen",
    docs: {
      toc: true,
    },
  },
  tags: ["autodocs"],
  argTypes: {
    image: { control: false },
  },
};

export default config;

export const SpotlightHero = {
  args: {
    variant: "spotlight",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    alignment: "left",
  },
};

export const SpotlightHeroWithCaption = {
  args: {
    variant: "spotlight",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    caption:
      "Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.",
    alignment: "left",
  },
};

export const SpotlightHeroWithCaptionAndButton = {
  args: {
    variant: "spotlight",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    caption:
      "Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.",
    button: { body: "Lorem Ipsum", href: "/example-page" },
    alignment: "left",
  },
};

export const SpotlightHeroWithCaptionAndModalVideo = {
  args: {
    variant: "spotlight",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    caption:
      "Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.",
    video: {
      src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
      title: "Why Choose U of G? - Banky",
      transcript:
        "https://preview-ugconthub.netlify.app/_gatsby/file/698e52bbf7d24a15d69d4a3c46c326ce/Banky_Why_Choose_U_of_G_Visual_Transcript.txt?url=https%3A%2F%2Fapi.liveugconthub.uoguelph.dev%2Fsites%2Fdefault%2Ffiles%2F2021-06%2FBanky_Why_Choose_U_of_G_Visual_Transcript.txt&cd=307f9699436c68e4c4b41f02e6e2946e",
    },
    alignment: "left",
  },
};

export const SpotlightHeroCenterAligned = {
  args: {
    variant: "spotlight",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    caption:
      "Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.",
    button: { body: "Lorem Ipsum", href: "/example-page" },
    alignment: "center",
  },
};

export const SpotlightHeroRightAligned = {
  args: {
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    caption:
      "Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.",
    button: { body: "Lorem Ipsum", href: "/example-page" },
    alignment: "right",
  },
};

export const SpotlightHeroFullWidth = {
  args: {
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    caption:
      "Repudiandae sit blanditiis minima harum laborum. Ipsa impedit eum eum sapiente explicabo accusantium tempore nihil.",
    button: { body: "Lorem Ipsum", href: "/example-page" },
    alignment: "fullWidth",
  },
};

export const ContentHubHero = {
  args: {
    variant: "content-hub",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
  },
};

export const ContentHubHeroWithModalVideo = {
  args: {
    variant: "content-hub",
    title: "Lorem Ipsum",
    image: {
      src: "https://picsum.photos/seed/hero/1680/640",
      height: 1680,
      width: 640,
      alt: "Placeholder image",
      blurred:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABWxJREFUWEd9V02LXUUUrL6TzEyMLvx1iiC4cOFGUBENKgGziOAHGIQgRnFUstBFQDEoKiFmxo+fE8TBebe7b0udOud2v5fRhJv3Xt7HqVNVp07f9OfJVw38kxL4F2lC4gU96nUC+BoJ+jDQGrAsDcuyYKkLSi0opaLkjHkumOcZ85yxOZux2fjF53NGngtyLva99H8AojjB8DkIMAAswNICQEWp1QDkzAIEkTFb4SwAK5Bsxc8FwALqfmDC2SBDApCs+9YamjNQjQECKCiZ3ROAM7BTfN44A6XuMGBFJUOnXlL07p0B0k8QpH9ZMAKw7nYBkIWzGSwucJLLJPjj5EuTVV3z39A9inf9rXvXnwyEB2qtqNS/iFoWIQjqHTLYo73WZwYAX7Sg9jwQYT4VFwNhQEpQl2oMVBYfJOgAJAe9IGAEIL+IgWMCEAedgc5Ed/+ov+iv9AC7pwdY3BmgEUU1Ox4f1T2vWihfQ/r9+GgFEOaTIKF9uJ/m49X6CLJzA6COSnGHs/AgRehOVqz7LNAG4LcHn3cPuPsfAcDCfG81n8bPqB8A2Ahah6J6XkeSxnTtCcC+5wBOfv3MPcCy7FqmE/WT6x7dk/owX9vpPgoIhIoHGOZD196KV/1OOr7/afdAUG9mEwjNvRhoDB8HUMlACfpH/TsDwQgpD+NR++rFKWd6cO+TLQBWNFKvOQMt+dwPADx86P5IQIZQlyEY4XR03a34CgBI93/5+FEAAwMyntJv7d41lPHU/Xbx7K/jfU6J627FPUkp/r2fbu4AEP2NTKzFxYABqNRe5tPyifkfDMig8f8n5bvFlaI+/D//8NF/MtC7T4aaAFScP9qznwFE6ouNWQ8kfWa3c/5ObNSE9OP3H65ToER04w0MqHgHYD/KzWfUj53zuehXcUa0BxZpN+olZ2zWdPfbD85loNGALkEUJ/02w/7jHYCyfzSgzBlpqfCK37PiTcmavrvzrgHgm7ETzAOj/mv3zYsretfQsZmfVwDBQISNTKei5q113IF055vrTcecWDbD7PMLC/Xn0oEvncj9fvhQ9gsAJVnpt8AZO/eAWw83Cenr29ce8cDYvcIHtni09eLkE4FD6udBAgLQslHgkN7onMe7va0zRrp9dHX1gNatU2XhE+nH7gVgy/1mQO/+HAaMeqOfne9ZcRDAeO48uvXGlgm1dBQ+Ma/GgAGI2Xf6DQC75/Fr9omQBFq3oT3T9YK6Hy5b/7duvhYHXd94nvtD9zYFFr0+fjZmMt7sAMKE4QGyNXYPEMAFpGkEkpBu3ni5S+CT0EfG55/d0wOuv/Z+jB4Z2KxMBADLe2OS9LPoRQMwGQBefvy/8d6LGsM4FcXm87gMAxoDsf1c+6A/580KggC0Jak/2bywApgmgriINIUUE9L7119wABEOPa3CA9pgfpCws5/GrXdOBjYodskDGj/miRdN+1bcQKwyTEjvvP38AMDzwFOL808dufvlAZor4pdzT+Ox+7MtAMaATQC7vwhgH2k6wEQQE0HIB3bjc+2t54Yp6N2bD+LuxydAUyADFpqPHVvxMwNR8hlKmU2CZZkcwAGAA6TpENNEFva3AVy98uw6BQoMHbtXAMPdT7X7PzFQiihX9/+grNcG/NxS99DaAdAuIaVDXROBBAA34puvPrMzhh2AjR9vQCxSaSwHUEg9r14851OUfIqa/0atGUs9RGuXAfC6hGkikACgiTAJrrzytADEPoju/f5PhxBuNemvLTc7Aw5gPkVm4fzQ5LEJMBM+jtaeQEqXkdJj8oGxQADugddfeqoz4M/i/K81rPu/kYFaXH+nXd3/hZIfohbYZSG07KPhyQFA9wFHkVv3X7/qiMEo4XbjAAAAAElFTkSuQmCC",
    },
    video: {
      src: "https://www.youtube.com/watch?v=vmILmBbl8hk",
      title: "Why Choose U of G? - Banky",
      transcript:
        "https://preview-ugconthub.netlify.app/_gatsby/file/698e52bbf7d24a15d69d4a3c46c326ce/Banky_Why_Choose_U_of_G_Visual_Transcript.txt?url=https%3A%2F%2Fapi.liveugconthub.uoguelph.dev%2Fsites%2Fdefault%2Ffiles%2F2021-06%2FBanky_Why_Choose_U_of_G_Visual_Transcript.txt&cd=307f9699436c68e4c4b41f02e6e2946e",
    },
  },
};
