export type Poem = {
  id: string;
  title: string;

  content_en?: string;
  content_hi?: string;
  content_gu?: string;

  pdfUrl?: string;
  audioUrl?: string;

  likes?: number;
};