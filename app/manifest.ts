import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SafeBand – Emergency Safety Network",
    short_name: "SafeBand",
    description:
      "Stay connected and protected. Instantly alert your trusted safety network with one tap.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#2c5b4c",
    theme_color: "#2c5b4c",
    orientation: "portrait",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
