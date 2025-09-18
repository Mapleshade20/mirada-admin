import { Box, Typography } from "@mui/material";
import type React from "react";
import { useRecordContext } from "react-admin";

interface ImageFieldProps {
  source: string;
  label?: string;
  maxWidth?: string;
  maxHeight?: string;
  alt?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  source,
  label,
  maxWidth = "200px",
  maxHeight = "200px",
  alt = "Image",
}) => {
  const record = useRecordContext();

  if (!record) return null;

  const getNestedValue = (obj: unknown, path: string): unknown => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const imageUri = getNestedValue(record, source);

  if (!imageUri) {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No image available
        </Typography>
      </Box>
    );
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8091";
  const imageUrl = imageUri.startsWith("http")
    ? imageUri
    : `${baseUrl}${imageUri}`;

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
      )}
      <img
        src={imageUrl}
        alt={alt}
        style={{
          maxWidth,
          maxHeight,
          borderRadius: "8px",
          objectFit: "cover",
          border: "1px solid #e0e0e0",
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        className="hidden"
        sx={{ display: "none", mt: 1 }}
      >
        Failed to load image
      </Typography>
    </Box>
  );
};
