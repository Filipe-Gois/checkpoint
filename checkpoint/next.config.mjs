/** @type {import('next').NextConfig} */
const nextConfig = {
  //configuração para permitir que o Next/image renderize imagens vindas do google
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blobcheckpointgabriel.blob.core.windows.net", // Para imagens do Azure Blob Storage
        pathname: "/**", // Permite qualquer caminho após o domínio
      },
    ],
  },
};

export default nextConfig;
