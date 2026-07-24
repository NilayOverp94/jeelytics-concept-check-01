/// <reference types="vite/client" />

declare module "*.asset.json" {
  const asset: {
    url: string;
    original_filename?: string;
    content_type?: string;
  };
  export default asset;
}
