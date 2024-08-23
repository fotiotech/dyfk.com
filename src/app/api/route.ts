import { NextRequest, NextResponse } from "next/server";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { connection } from "@/utils/connection";
import HeroContent from "@/models/HeroContent";

export async function GET(req: NextRequest) {
  await connection();

  const result = await HeroContent.find();

  if (result) {
    return NextResponse.json({ results: result }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const cta_text = formData.get("cta_text") as string | null;
  const cta_link = formData.get("cta_link") as string | null;
  const imageUrl = formData.get("imageUrl") as File | null;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image file is required." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await imageUrl.arrayBuffer());
    const relativeUploadDir = `heroFiles/${new Date()
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-")}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error("Error creating directory:\n", e);
        return NextResponse.json(
          { error: "Something went wrong while creating directory." },
          { status: 500 }
        );
      }
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${imageUrl.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(imageUrl.type)}`;
    await writeFile(join(uploadDir, filename), buffer);
    const heroFileUrl = `${process.env.NEXT_PUBLIC_API_URL}/${relativeUploadDir}/${filename}`;

    await connection();
    const newHeroContent = new HeroContent({
      title: title,
      description: description,
      imageUrl: heroFileUrl,
      cta_text: cta_text,
      cta_link: cta_link,
    });
    const savedHeroContent = await newHeroContent.save();

    return NextResponse.json(
      {
        results: savedHeroContent,
        message: "Inserted successfully!",
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error while processing the request:\n", e);
    return NextResponse.json(
      { error: "Something went wrong.", message: e.message },
      { status: 500 }
    );
  }
}
