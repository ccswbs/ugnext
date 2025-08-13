import "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "uofg-header": {
        "page-url": string;
        "page-title": string;
        variant: string;
        [key: string]: any;
      };
    }
  }
}
