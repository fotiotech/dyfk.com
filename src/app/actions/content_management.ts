import HeroContent from "@/models/HeroContent";
import { connection } from "@/utils/connection";

export async function createHeroContent(files: string[], formData: FormData) {
    await connection();
    if(!formData) return

       const title = formData.get('title') as string;
       const description = formData.get('description') as string;
       const cta_text = formData.get('cta_text') as string;
       const cta_link = formData.get('cta_link') as string;
    
    try {
        const newHeroContent = new HeroContent({
            title: title,
            description: description,
            imageUrl: files,
            cta_text: cta_text,
            cta_link: cta_link,
          });
          const savedHeroContent = await newHeroContent.save();
          return savedHeroContent;
    } catch (error) {
        console.error(error)
    }
    
}