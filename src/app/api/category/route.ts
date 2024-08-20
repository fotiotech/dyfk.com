import Category from "@/models/Category";
import CategoryFile from "@/models/Category_files"; // Import the CategoryFile model
import { connection } from "@/utils/connection";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { Fields, Files, IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const runtime = "nodejs";

function generateSlug(name: string) {
  return slugify(name, { lower: true });
}

export async function GET(req: NextRequest) {
  await connection();

  const category = await Category.find();

  if (category) {
    return NextResponse.json({ results: category });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}

// Helper function to convert ReadableStream to a Node.js stream
async function convertRequestToStream(
  req: NextRequest
): Promise<IncomingMessage> {
  const readableStream = Readable.from(req.body as any);

  const incomingMessage = new IncomingMessage(req.headers as any);
  incomingMessage.url = req.url;
  incomingMessage.method = req.method;
  incomingMessage.headers = Object.fromEntries(req.headers.entries());

  readableStream.on("data", (chunk) => {
    incomingMessage.push(chunk);
  });

  readableStream.on("end", () => {
    incomingMessage.push(null);
  });

  return incomingMessage;
}

export async function POST(req: NextRequest): Promise<Response> {
  await connection();

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: uploadDir, // Set the directory where files will be uploaded
    keepExtensions: true, // Keep file extensions
    multiples: true, // Enable multiple files upload
  });

  const incomingMessage = await convertRequestToStream(req);

  return new Promise<Response>((resolve, reject) => {
    form.parse(
      incomingMessage,
      async (err: Error | null, fields: Fields, files: Files) => {
        if (err) {
          return reject(
            NextResponse.json(
              { message: "Error parsing form data" },
              { status: 500 }
            )
          );
        }

        const { categoryId, category_name, description } = fields;
        const url_slug = generateSlug(category_name as unknown as string);

        const images = Array.isArray(files.imageUrl)
          ? files.imageUrl
          : [files.imageUrl];

        if (images.length === 0) {
          return reject(
            NextResponse.json(
              { message: "No images uploaded" },
              { status: 400 }
            )
          );
        }

        try {
          await connection();

          // Save the first image in the Category model
          const firstImage = images[0];
          const newCategory = new Category({
            url_slug,
            categoryName: category_name,
            parent_id: categoryId || null,
            description: description || null,
            imageUrl: firstImage
              ? `${process.env.NEXT_PUBLIC_API_URL}/` +
                path.basename(firstImage.filepath)
              : null,
          });

          const savedCategory = await newCategory.save();

          // Save the remaining images in the CategoryFile collection
          if (images.length > 1) {
            const additionalFiles = images.slice(1);
            for (const file of additionalFiles) {
              const newCategoryFile = new CategoryFile({
                id_category: savedCategory._id,
                fileUrl:
                  `${process.env.NEXT_PUBLIC_API_URL}/` +
                  path.basename(file?.filepath!),
                originalName: file?.originalFilename || "",
              });
              await newCategoryFile.save();
            }
          }

          resolve(
            NextResponse.json(
              {
                message: "Category created successfully",
                category: savedCategory,
              },
              { status: 201 }
            )
          );
        } catch (error: any) {
          console.error("Error creating category", error);
          reject(
            NextResponse.json(
              { message: "Error creating category", error: error.message },
              { status: 500 }
            )
          );
        }
      }
    );
  });
}
