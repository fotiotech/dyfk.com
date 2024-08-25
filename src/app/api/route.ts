"use server";
import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/utils/connection";
import HeroContent from "@/models/HeroContent";
import { storage } from "@/utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextApiResponse } from "next";


export async function GET(req: NextRequest) {
  await connection();

  const result = await HeroContent.find();

  if (result) {
    return NextResponse.json({ results: result }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Nothing found" }, { status: 401 });
  }
}

export async function POST(
  req: Request,
  res: NextApiResponse
) {
  const formData = await req.formData();

  const title = formData.get("title") as string | null;
  const description = formData.get("description") as string | null;
  const cta_text = formData.get("cta_text") as string | null;
  const cta_link = formData.get("cta_link") as string | null;
  const imageUrl = formData.get("imageUrl") as File | null;
  // const gRecaptchaToken = formData.get("gRecaptchaToken ") as File | null;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image file is required." },
      { status: 400 }
    );
  }

  try {
    // Verify the ReCaptcha token
    // const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${gRecaptchaToken}`;
    // const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
    //   method: "POST",
    // });
    // const recaptchaData = await recaptchaResponse.json();

    // if (!recaptchaData.success || recaptchaData.score < 0.5) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "ReCaptcha verification failed.",
    //     score: recaptchaData.score || 0,
    //   });
    // }

    const storageRef = ref(storage, `uploads/${imageUrl.name}`);
    await uploadBytes(storageRef, imageUrl);
    const downloadURL = await getDownloadURL(storageRef);

    await connection();

    const newHeroContent = new HeroContent({
      title: title,
      description: description,
      imageUrl: downloadURL,
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
    return res.status(400).json({
      success: false,
      error: "Bad request",
      score: 0,
    });
  }
}
