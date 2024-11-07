import Image from "next/image";

type image = { file: unknown; url: string };

interface imageUploadProps {
  images: image[];
  setImages: (param: (arg: image[]) => image[]) => void;
}

export default function ImageUpload({ images, setImages }: imageUploadProps) {
  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          width: "300px",
          height: "200px",
          border: "2px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexDirection: "column",
        }}
      >
        {images.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`Dropped ${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
            ))}
          </div>
        ) : (
          <p>Drag & drop images here</p>
        )}
      </div>
      <input
        title="image"
        type="file"
        onChange={handleFileChange}
        multiple
        style={{ marginTop: "10px" }}
      />
    </div>
  );
}
