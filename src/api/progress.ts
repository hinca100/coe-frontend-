import api from "./axios";

export interface Progress {
  _id: string;
  courseId: {
    _id: string;
    title: string;
  };
  chapterId: {
    _id: string;
    title: string;
  };
  completedAt: string;
}

export async function getMyProgress() {
  const { data } = await api.get<Progress[]>("/progress");
  return data;
}