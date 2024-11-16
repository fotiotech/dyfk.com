"use server";
import HeroContent from "@/models/HeroContent";
import { connection } from "@/utils/connection";
import { revalidatePath } from "next/cache";

export async function findHeroContent() {
  await connection();
  const heroContent = await HeroContent.find().sort({ created_at: -1 });

  if (heroContent) {
    return heroContent.map((res) => ({
      ...res.toObject(),
      _id: res._id?.toString(),
      // created_at: res.created_at?.toISOString(),
      // updated_at: res.updated_at?.toISOString(),
    }));
  }
}

export async function createHeroContent(files: string[], formData: FormData) {
  await connection();
  if (!formData) return;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const cta_text = formData.get("cta_text") as string;
  const cta_link = formData.get("cta_link") as string;

  try {
    const newHeroContent = new HeroContent({
      title: title,
      description: description,
      imageUrl: files,
      cta_text: cta_text,
      cta_link: cta_link,
    });
    await newHeroContent.save();
    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
}
